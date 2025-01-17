/* eslint-disable jest/no-commented-out-tests */
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
import {StubCmd} from "../command/StubCmd";
import {createTouchEvent} from "../interaction/StubEvents";
import type {Binding, Interaction, InteractionData} from "../../src/interacto";
import {BindingsImpl} from "../../src/interacto";
import {BindingsContext} from "../../src/impl/binding/BindingsContext";
import type {Bindings} from "../../src/api/binding/Bindings";

let binding: Binding<StubCmd, Interaction<InteractionData>, InteractionData> | undefined;
let c1: HTMLElement;
let ctx: BindingsContext;
let bindings: Bindings;

beforeEach(() => {
    bindings = new BindingsImpl();
    ctx = new BindingsContext();
    bindings.setBindingObserver(ctx);
    jest.useFakeTimers();
    c1 = document.createElement("canvas");
});

afterEach(() => {
    bindings.clear();
    jest.clearAllTimers();
});

test("touch move: too slow too short", () => {
    binding = bindings.swipeBinder(true, 400, 200, 1, 10)
        .toProduce(() => new StubCmd(true))
        .on(c1)
        .bind();

    c1.dispatchEvent(createTouchEvent("touchstart", 3, c1, 15, 20, 150, 200, 100));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1, 16, 30, 160, 210, 2000));

    expect(binding).toBeDefined();
    expect(binding.timesCancelled).toStrictEqual(0);
    expect(binding.timesEnded).toStrictEqual(0);
    expect(ctx.commands).toHaveLength(0);
});

[20, -30].forEach((y: number) => {
    test("touch move KO not horizontal enough", () => {
        binding = bindings.swipeBinder(true, 400, 200, 1, 10)
            .toProduce(() => new StubCmd(true))
            .on(c1)
            .bind();

        c1.dispatchEvent(createTouchEvent("touchstart", 3, c1, 15,
            20, 150, 200, 10));
        c1.dispatchEvent(createTouchEvent("touchmove", 3, c1, 16,
            20 + y, 160, 200 + y, 10));

        expect(binding).toBeDefined();
        expect(binding.timesCancelled).toStrictEqual(0);
        expect(binding.timesEnded).toStrictEqual(0);
        expect(ctx.commands).toHaveLength(0);
    });
});

[40, -50].forEach((y: number) => {
    test("touch move move release not horizontal enough", () => {
        binding = bindings.swipeBinder(true, 400, 200, 1, 10)
            .toProduce(() => new StubCmd(true))
            .on(c1)
            .bind();

        c1.dispatchEvent(createTouchEvent("touchstart", 3, c1, 150,
            20, 150, 200, 0));
        c1.dispatchEvent(createTouchEvent("touchmove", 3, c1, 160,
            20, 200, 200, 10));
        c1.dispatchEvent(createTouchEvent("touchmove", 3, c1, 350,
            20 + y, 250, 200 + y, 20));
        c1.dispatchEvent(createTouchEvent("touchend", 3, c1, 350,
            20 + y, 250, 200 + y, 20));

        expect(binding).toBeDefined();
        expect(binding.timesEnded).toStrictEqual(0);
        expect(ctx.commands).toHaveLength(0);
    });
});


test("touch move move too short too slow", () => {
    binding = bindings.swipeBinder(true, 400, 200, 1, 10)
        .toProduce(() => new StubCmd(true))
        .on(c1)
        .bind();

    c1.dispatchEvent(createTouchEvent("touchstart", 3, c1,
        100, 20, 150, 200, 5000));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        200, 30, 160, 201, 5200));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        299, 30, 349, 210, 5399));

    expect(binding).toBeDefined();
    expect(binding.timesCancelled).toStrictEqual(0);
    expect(binding.timesEnded).toStrictEqual(0);
    expect(ctx.commands).toHaveLength(0);
});

test("touch move move too short velocity OK", () => {
    binding = bindings.swipeBinder(true, 400, 200, 1, 10)
        .toProduce(() => new StubCmd(true))
        .on(c1)
        .bind();

    c1.dispatchEvent(createTouchEvent("touchstart", 3, c1,
        150, 20, 150, 200, 5000));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        160, 30, 160, 201, 5050));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        200, 30, 200, 210, 5100));

    expect(binding).toBeDefined();
    expect(binding.timesCancelled).toStrictEqual(0);
    expect(binding.timesEnded).toStrictEqual(0);
    expect(ctx.commands).toHaveLength(0);
});

test("touch move move distance OK short too slow", () => {
    binding = bindings.swipeBinder(true, 400, 200, 1, 10)
        .toProduce(() => new StubCmd(true))
        .on(c1)
        .bind();

    c1.dispatchEvent(createTouchEvent("touchstart", 3, c1,
        150, 20, 150, 200, 5000));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        160, 30, 160, 201, 6000));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        350, 30, 350, 210, 7000));

    expect(binding).toBeDefined();
    expect(binding.timesCancelled).toStrictEqual(0);
    expect(binding.timesEnded).toStrictEqual(0);
    expect(ctx.commands).toHaveLength(0);
});

test("touch move move release distance velocity OK 1s", () => {
    binding = bindings.swipeBinder(true, 400, 200, 1, 10)
        .toProduce(() => new StubCmd(true))
        .on(c1)
        .bind();

    c1.dispatchEvent(createTouchEvent("touchstart", 3, c1,
        50, 20, 100, 200, 5000));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        160, 30, 160, 201, 5500));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        250, 30, 500, 210, 6000));
    c1.dispatchEvent(createTouchEvent("touchend", 3, c1,
        450, 30, 500, 210, 6000));

    expect(binding).toBeDefined();
    expect(binding.timesCancelled).toStrictEqual(0);
    expect(binding.timesEnded).toStrictEqual(1);
    expect(ctx.commands).toHaveLength(1);
    expect(ctx.getCmd(0)).toBeInstanceOf(StubCmd);
});

test("touch move move release distance velocity OK 200px", () => {
    binding = bindings.swipeBinder(true, 400, 200, 1, 10)
        .toProduce(() => new StubCmd(true))
        .on(c1)
        .bind();

    c1.dispatchEvent(createTouchEvent("touchstart", 3, c1,
        50, 20, 100, 200, 5000));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        160, 30, 160, 201, 5200));
    c1.dispatchEvent(createTouchEvent("touchmove", 3, c1,
        250, 30, 300, 210, 5500));
    c1.dispatchEvent(createTouchEvent("touchend", 3, c1,
        250, 30, 300, 210, 5500));

    expect(binding).toBeDefined();
    expect(binding.timesCancelled).toStrictEqual(0);
    expect(binding.timesEnded).toStrictEqual(1);
    expect(ctx.commands).toHaveLength(1);
    expect(ctx.getCmd(0)).toBeInstanceOf(StubCmd);
});
