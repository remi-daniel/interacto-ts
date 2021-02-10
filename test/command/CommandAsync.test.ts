/*
 * This file is part of Interacto.
 * Interacto is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * Interacto is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with Interacto.  If not, see <https://www.gnu.org/licenses/>.
 */

import {CommandsRegistry} from "../../src/impl/command/CommandsRegistry";
import {UndoHistory} from "../../src/impl/undo/UndoHistory";
import {CmdStatus} from "../../src/api/command/Command";
import {CommandBase} from "../../src/impl/command/CommandBase";
import {Binding} from "../../src/api/binding/Binding";
import {Interaction} from "../../src/api/interaction/Interaction";
import {InteractionData} from "../../src/api/interaction/InteractionData";
import {Subject, Subscription} from "rxjs";
import {buttonBinder, dndBinder, multiTouchBinder} from "../../src/api/binding/Bindings";
import {flushPromises} from "../Utils";
import {createMouseEvent, createTouchEvent} from "../interaction/StubEvents";
import {LogLevel} from "../../src/api/logging/LogLevel";
import useFakeTimers = jest.useFakeTimers;
import clearAllTimers = jest.clearAllTimers;
import useRealTimers = jest.useRealTimers;
import runAllTimers = jest.runAllTimers;
import advanceTimersByTime = jest.advanceTimersByTime;
import fn = jest.fn;
import clearAllMocks = jest.clearAllMocks;

class Model {
    public data: Array<string> = ["Foo", "Bar", "Yo"];
}


class StubAsyncCmd extends CommandBase {
    public readonly data: Model;

    public readonly timeout: number;

    public readonly accept: boolean;

    public constructor(data: Model, timeout = 20, resolve = true) {
        super();
        this.data = data;
        this.timeout = timeout;
        this.accept = resolve;
    }

    protected execution(): Promise<void> | void {
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    if (this.accept) {
                        this.data.data.pop();
                        resolve();
                    } else {
                        reject(new Error("Invalid request"));
                    }
                }, this.timeout);
            }
        );
    }


    public hadEffect(): boolean {
        return super.hadEffect() && this.accept;
    }
}


let cmd: StubAsyncCmd;
let data: Model;
let binding: Binding<StubAsyncCmd, Interaction<InteractionData>, InteractionData> | undefined;
let producedCmds: Array<StubAsyncCmd>;
let disposable: Subscription | undefined;

describe("testing async commands and bindings", () => {
    beforeEach(() => {
        data = new Model();
        cmd = new StubAsyncCmd(data);
    });

    afterEach(async () => {
        CommandsRegistry.getInstance().clear();
        UndoHistory.getInstance().clear();
        clearAllTimers();
        clearAllMocks();
        disposable?.unsubscribe();
        binding?.uninstallBinding();
        await flushPromises();
    });

    describe("async command alone", () => {
        test("when promise not ended command not ended", () => {
            useFakeTimers();
            const res = cmd.execute();

            expect(res).toBeDefined();
            expect(cmd.getStatus()).toStrictEqual(CmdStatus.created);
            expect(data.data).toStrictEqual(["Foo", "Bar", "Yo"]);
        });

        test("when promise ended command also ended", async () => {
            useRealTimers();
            const res = await cmd.execute();

            expect(res).toBeDefined();
            expect(cmd.getStatus()).toStrictEqual(CmdStatus.executed);
            expect(data.data).toStrictEqual(["Foo", "Bar"]);
        });

        test("two commands executed", async () => {
            useRealTimers();
            const cmd2 = new StubAsyncCmd(data);
            await Promise.all([cmd.execute(), cmd2.execute()]);

            expect(data.data).toStrictEqual(["Foo"]);
        });
    });


    describe("async with a standard binding", () => {
        let button1: HTMLButtonElement;

        beforeEach(() => {
            useFakeTimers();
            button1 = document.createElement("button");
            producedCmds = [];
        });


        test("button binding with async command works", async () => {
            binding = buttonBinder()
                .toProduce(() => new StubAsyncCmd(data, 20))
                .on(button1)
                .bind();

            disposable = binding.produces().subscribe(c => producedCmds.push(c));

            button1.click();
            runAllTimers();
            await flushPromises();

            expect(binding).toBeDefined();
            expect(binding.getCommand()).toBeUndefined();
            expect(producedCmds).toHaveLength(1);
            expect(producedCmds[0].getStatus()).toStrictEqual(CmdStatus.done);
            expect(data.data).toStrictEqual(["Foo", "Bar"]);
        });

        test("button binding with async command does not end when the command is not disposed", async () => {
            const end = jest.fn(() => {
            });
            const first = jest.fn(() => {
            });
            binding = buttonBinder()
                .toProduce(() => new StubAsyncCmd(data, 50))
                .on(button1)
                .end(end)
                .first(first)
                .bind();

            button1.click();
            advanceTimersByTime(49);
            await flushPromises();
            expect(binding.getCommand()).toBeDefined();
            expect(end).not.toHaveBeenCalled();
            expect(first).toHaveBeenCalledTimes(1);
            expect(data.data).toStrictEqual(["Foo", "Bar", "Yo"]);
        });


        test("button binding with async command ends when the command is disposed", async () => {
            const end = jest.fn(() => {
            });
            const first = jest.fn(() => {
            });
            binding = buttonBinder()
                .toProduce(() => new StubAsyncCmd(data, 50))
                .on(button1)
                .end(end)
                .first(first)
                .bind();

            button1.click();
            advanceTimersByTime(51);
            await flushPromises();
            expect(binding.getCommand()).toBeUndefined();
            expect(end).toHaveBeenCalledTimes(1);
            expect(first).toHaveBeenCalledTimes(1);
        });

        test("two button clicks with async command work in good time order (1)", async () => {
            binding = buttonBinder()
                .toProduce(fn()
                    .mockReturnValueOnce(new StubAsyncCmd(data, 100))
                    .mockReturnValueOnce(new StubAsyncCmd(data, 5)))
                .on(button1)
                .bind();

            disposable = binding.produces().subscribe(c => producedCmds.push(c));

            button1.click();
            button1.click();
            advanceTimersByTime(10);
            await flushPromises();
            runAllTimers();
            await flushPromises();

            expect(binding).toBeDefined();
            expect(binding.getCommand()).toBeUndefined();
            expect(producedCmds).toHaveLength(2);
            expect(producedCmds[0].getStatus()).toStrictEqual(CmdStatus.done);
            expect(producedCmds[1].getStatus()).toStrictEqual(CmdStatus.done);
            expect(producedCmds[0].timeout).toStrictEqual(5);
            expect(producedCmds[1].timeout).toStrictEqual(100);
            expect(data.data).toStrictEqual(["Foo"]);
        });

        test("two button clicks with async command work in good time order (2)", async () => {
            binding = buttonBinder()
                .toProduce(fn()
                    .mockReturnValueOnce(new StubAsyncCmd(data, 5))
                    .mockReturnValueOnce(new StubAsyncCmd(data, 100)))
                .on(button1)
                .bind();

            disposable = binding.produces().subscribe(c => producedCmds.push(c));

            button1.click();
            button1.click();
            advanceTimersByTime(10);
            await flushPromises();
            runAllTimers();
            await flushPromises();

            expect(binding.getCommand()).toBeUndefined();
            expect(producedCmds).toHaveLength(2);
            expect(producedCmds[0].timeout).toStrictEqual(5);
            expect(producedCmds[1].timeout).toStrictEqual(100);
            expect(data.data).toStrictEqual(["Foo"]);
        });


        test("two button clicks with async command, first/end ok when waiting ongoing cmd", async () => {
            cmd = new StubAsyncCmd(data, 50);
            const cmd2 = new StubAsyncCmd(data, 5);
            const end = jest.fn(() => {
            });
            const first = jest.fn(() => {
            });

            binding = buttonBinder()
                .toProduce(fn()
                    .mockReturnValueOnce(cmd)
                    .mockReturnValueOnce(cmd2))
                .end(end)
                .first(first)
                .on(button1)
                .bind();

            button1.click();
            runAllTimers();
            await flushPromises();
            button1.click();
            runAllTimers();
            await flushPromises();

            expect(first).toHaveBeenCalledTimes(2);
            expect(end).toHaveBeenNthCalledWith(1, cmd, expect.anything());
            expect(end).toHaveBeenNthCalledWith(2, cmd2, expect.anything());
            expect(end).toHaveBeenCalledTimes(2);
            expect(end).toHaveBeenNthCalledWith(1, cmd, expect.anything());
            expect(end).toHaveBeenNthCalledWith(2, cmd2, expect.anything());
        });

        test("two button clicks with async command, first/end ok when not waiting ongoing cmd", async () => {
            cmd = new StubAsyncCmd(data, 100);
            const cmd2 = new StubAsyncCmd(data, 50);
            const end = jest.fn(() => {
            });
            const first = jest.fn(() => {
            });

            binding = buttonBinder()
                .toProduce(fn()
                    .mockReturnValueOnce(cmd)
                    .mockReturnValueOnce(cmd2))
                .end(end)
                .first(first)
                .on(button1)
                .bind();

            button1.click();
            advanceTimersByTime(40);
            await flushPromises();
            button1.click();
            // Triggering the command cmd2
            advanceTimersByTime(20);
            await flushPromises();
            // Triggering the command cmd
            runAllTimers();
            await flushPromises();

            expect(first).toHaveBeenCalledTimes(2);
            expect(binding.getCommand()).toBeUndefined();
            expect(binding.getTimesEnded()).toStrictEqual(2);
            expect(end).toHaveBeenCalledTimes(2);
            expect(end).toHaveBeenNthCalledWith(1, cmd2, expect.anything());
            expect(end).toHaveBeenNthCalledWith(2, cmd, expect.anything());
        });


        test("button binding with async command that rejects works", async () => {
            binding = buttonBinder()
                .toProduce(() => new StubAsyncCmd(data, 20, false))
                .on(button1)
                .bind();

            disposable = binding.produces().subscribe(c => producedCmds.push(c));

            button1.click();
            runAllTimers();
            await flushPromises();

            expect(binding).toBeDefined();
            expect(binding.getTimesEnded()).toStrictEqual(1);
            expect(binding.getCommand()).toBeUndefined();
            expect(producedCmds).toHaveLength(1);
        });

        test("button binding with async command OK when 'end' crashes", async () => {
            binding = buttonBinder()
                .toProduce(() => new StubAsyncCmd(data))
                .on(button1)
                .bind();

            disposable = binding.produces().subscribe(c => producedCmds.push(c));

            // Need to provoke an error. So closing a stream
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            (binding as unknown).cmdsProduced.unsubscribe();
            button1.click();
            runAllTimers();
            await flushPromises();

            // Need to reopen the stream not to provoke crash on flush
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            (binding as unknown).cmdsProduced = new Subject();

            expect(binding).toBeDefined();
            expect(binding.getCommand()).toBeUndefined();
            expect(binding.getTimesEnded()).toStrictEqual(1);
            expect(producedCmds).toHaveLength(0);
        });
    });

    describe("async with a dnd binding", () => {
        let canvas: HTMLCanvasElement;

        beforeEach(() => {
            useFakeTimers();
            canvas = document.createElement("canvas");
            producedCmds = [];
        });

        test("dnd binding with async command OK when 'end' crashes", async () => {
            binding = dndBinder(false)
                .toProduce(() => new StubAsyncCmd(data))
                .on(canvas)
                .bind();

            disposable = binding.produces().subscribe(c => producedCmds.push(c));

            canvas.dispatchEvent(createMouseEvent("mousedown", canvas));
            canvas.dispatchEvent(createMouseEvent("mousemove", canvas));
            canvas.dispatchEvent(createMouseEvent("mouseup", canvas));

            runAllTimers();
            await flushPromises();

            expect(binding).toBeDefined();
            expect(binding.getCommand()).toBeUndefined();
            expect(binding.getTimesEnded()).toStrictEqual(1);
            expect(producedCmds).toHaveLength(1);
        });

        test("dnd binding with async command and continuous execution", async () => {
            const cannot = jest.fn(() => {});

            binding = dndBinder(false)
                .toProduce(() => new StubAsyncCmd(data))
                .on(canvas)
                .continuousExecution()
                .log(LogLevel.command)
                .ifCannotExecute(cannot)
                .bind();

            disposable = binding.produces().subscribe(c => producedCmds.push(c));

            canvas.dispatchEvent(createMouseEvent("mousedown", canvas));
            canvas.dispatchEvent(createMouseEvent("mousemove", canvas));
            canvas.dispatchEvent(createMouseEvent("mousemove", canvas));
            canvas.dispatchEvent(createMouseEvent("mousemove", canvas));
            canvas.dispatchEvent(createMouseEvent("mouseup", canvas));

            runAllTimers();
            await flushPromises();

            expect(binding).toBeDefined();
            expect(binding.getCommand()).toBeUndefined();
            expect(binding.getTimesEnded()).toStrictEqual(1);
            expect(producedCmds).toHaveLength(1);
            expect(cannot).not.toHaveBeenCalled();
            expect(data.data).toHaveLength(0);
        });

        test("dnd binding with async command and continuous execution and crash", async () => {
            const cannot = jest.fn(() => {});

            binding = dndBinder(false)
                .toProduce(() => new StubAsyncCmd(data, 50, false))
                .on(canvas)
                .continuousExecution()
                .ifCannotExecute(cannot)
                .log(LogLevel.command)
                .bind();

            disposable = binding.produces().subscribe(c => producedCmds.push(c));

            jest.spyOn(binding, "ifCannotExecuteCmd").mockImplementation(() => {
                throw new Error("Error");
            });

            canvas.dispatchEvent(createMouseEvent("mousedown", canvas));
            canvas.dispatchEvent(createMouseEvent("mousemove", canvas));
            canvas.dispatchEvent(createMouseEvent("mouseup", canvas));

            runAllTimers();
            await flushPromises();

            expect(binding.getCommand()).toBeUndefined();
            expect(binding.getTimesEnded()).toStrictEqual(1);
            expect(producedCmds).toHaveLength(0);
            expect(data.data).toStrictEqual(["Foo", "Bar", "Yo"]);
        });
    });


    describe("async with a multi-touch binding (recycling events)", () => {
        let canvas: HTMLCanvasElement;

        beforeEach(() => {
            useFakeTimers();
            canvas = document.createElement("canvas");
            producedCmds = [];
        });

        test("button binding with async command OK when 'end' crashes", async () => {
            binding = multiTouchBinder(2)
                .toProduce(() => new StubAsyncCmd(data))
                .on(canvas)
                .bind();

            disposable = binding.produces().subscribe(c => producedCmds.push(c));

            canvas.dispatchEvent(createTouchEvent("touchstart", 1, canvas, 11, 23, 110, 230));
            canvas.dispatchEvent(createTouchEvent("touchstart", 2, canvas, 31, 13, 310, 130));
            canvas.dispatchEvent(createTouchEvent("touchmove", 2, canvas, 15, 30, 150, 300));
            canvas.dispatchEvent(createTouchEvent("touchend", 2, canvas, 15, 30, 150, 300));
            canvas.dispatchEvent(createTouchEvent("touchstart", 3, canvas, 31, 13, 310, 130));
            canvas.dispatchEvent(createTouchEvent("touchmove", 3, canvas, 15, 30, 150, 300));
            canvas.dispatchEvent(createTouchEvent("touchend", 1, canvas, 15, 30, 150, 300));


            runAllTimers();
            await flushPromises();

            expect(binding).toBeDefined();
            expect(producedCmds).toHaveLength(2);
        });
    });
});

