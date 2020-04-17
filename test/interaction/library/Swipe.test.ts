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

import {StubFSMHandler} from "../../fsm/StubFSMHandler";
import {createTouchEvent} from "../StubEvents";
import {EventRegistrationToken, FSMHandler, Swipe} from "../../../src/interacto";

jest.mock("../../fsm/StubFSMHandler");

let interaction: Swipe;
let canvas: HTMLElement;
let handler: FSMHandler;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let data: any;

beforeEach(() => {
    handler = new StubFSMHandler();
    document.documentElement.innerHTML = "<html><div><canvas id='canvas1' /></div></html>";
    canvas = document.getElementById("canvas1") as HTMLElement;
});

afterEach(() => {
    interaction.uninstall();
    jest.clearAllTimers();
    jest.clearAllMocks();
});

describe("horizontal", () => {
    beforeEach(() => {
        interaction = new Swipe(true, 100, 10);
        interaction.getFsm().addHandler(handler);
    });

    test("not created twice", () => {
        interaction.getFsm().buildFSM();
        expect(interaction.getFsm().getStates()).toHaveLength(5);
    });

    test("touch", () => {
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 2, canvas));
        expect(handler.fsmStarts).not.toHaveBeenCalled();
        expect(handler.fsmStops).not.toHaveBeenCalled();
        expect(handler.fsmCancels).not.toHaveBeenCalled();
    });

    test("touch move OK", () => {
        interaction.getFsm().addHandler(new class extends StubFSMHandler {
            public fsmStarts(): void {
                data = {...interaction.getData()};
            }
        }());

        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 3, canvas, 15, 20, 150, 200));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 16, 30, 160, 210));

        expect(handler.fsmStarts).toHaveBeenCalledTimes(1);
        expect(handler.fsmStops).not.toHaveBeenCalled();
        expect(handler.fsmCancels).not.toHaveBeenCalled();
        expect(data.srcClientX).toBe(150);
        expect(data.srcClientY).toBe(200);
        expect(data.srcScreenX).toBe(15);
        expect(data.srcScreenY).toBe(20);
        expect(data.tgtClientX).toBe(160);
        expect(data.tgtClientY).toBe(210);
        expect(data.tgtScreenX).toBe(16);
        expect(data.tgtScreenY).toBe(30);
        expect(data.touchID).toBe(3);
        expect(data.button).toBeUndefined();
        expect(data.tgtObject).toBe(canvas);
    });

    [11, -11].forEach(y => {
        test("touch move KO not horizontal enough", () => {
            interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 3, canvas, 15,
                20, 150, 200));
            interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 16,
                20 + y, 160, 200 + y));
            expect(handler.fsmStarts).not.toHaveBeenCalled();
            expect(handler.fsmStops).not.toHaveBeenCalled();
            expect(handler.fsmCancels).not.toHaveBeenCalled();
        });
    });

    test("touch release", () => {
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 2, canvas));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchend, 2, canvas));
        expect(handler.fsmStarts).not.toHaveBeenCalled();
        expect(handler.fsmStops).not.toHaveBeenCalled();
        expect(handler.fsmCancels).not.toHaveBeenCalled();
    });

    test("touch move KO not same ID", () => {
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 2, canvas));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 1, canvas));
        expect(handler.fsmStarts).not.toHaveBeenCalled();
        expect(handler.fsmStops).not.toHaveBeenCalled();
        expect(handler.fsmCancels).not.toHaveBeenCalled();
    });


    [11, -11].forEach(y => {
        test("touch move move cancelled not horizontal enough", () => {
            interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 3, canvas, 15,
                20, 150, 200));
            interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 16,
                20, 160, 200));
            interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 16,
                20 + y, 160, 200 + y));
            expect(handler.fsmStarts).toHaveBeenCalledTimes(1);
            expect(handler.fsmStops).not.toHaveBeenCalled();
            expect(handler.fsmCancels).toHaveBeenCalledTimes(1);
        });
    });

    test("touch move move OK", () => {
        interaction.getFsm().addHandler(new class extends StubFSMHandler {
            public fsmUpdates(): void {
                data = {...interaction.getData()};
            }
        }());

        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 3, canvas, 15, 20, 150, 200));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 16, 30, 160, 201));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 17, 30, 170, 210));

        expect(handler.fsmStarts).toHaveBeenCalledTimes(1);
        expect(handler.fsmUpdates).toHaveBeenCalledTimes(2);
        expect(handler.fsmStops).not.toHaveBeenCalled();
        expect(handler.fsmCancels).not.toHaveBeenCalled();
        expect(data.srcClientX).toBe(150);
        expect(data.srcClientY).toBe(200);
        expect(data.srcScreenX).toBe(15);
        expect(data.srcScreenY).toBe(20);
        expect(data.tgtClientX).toBe(170);
        expect(data.tgtClientY).toBe(210);
        expect(data.tgtScreenX).toBe(17);
        expect(data.tgtScreenY).toBe(30);
        expect(data.touchID).toBe(3);
        expect(data.button).toBeUndefined();
        expect(data.tgtObject).toBe(canvas);
    });

    test("touch move move not horiz", () => {
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 3, canvas, 15, 20, 150, 200));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 16, 30, 160, 201));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 17, 41, 170, 212));

        expect(handler.fsmStarts).toHaveBeenCalledTimes(1);
        expect(handler.fsmUpdates).toHaveBeenCalledTimes(1);
        expect(handler.fsmStops).not.toHaveBeenCalled();
        expect(handler.fsmCancels).toHaveBeenCalledTimes(1);
    });

    test("touch move move release before distance min", () => {
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 3, canvas, 15, 20, 150, 200));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 16, 30, 160, 201));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 17, 30, 170, 210));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchend, 3, canvas, 114, 30, 249, 210));

        expect(handler.fsmStarts).toHaveBeenCalledTimes(1);
        expect(handler.fsmStops).not.toHaveBeenCalled();
        expect(handler.fsmCancels).toHaveBeenCalledTimes(1);
    });


    test("touch move move release OK", () => {
        interaction.getFsm().addHandler(new class extends StubFSMHandler {
            public fsmStops(): void {
                data = {...interaction.getData()};
            }
        }());

        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchstart, 3, canvas, 15, 20, 150, 200));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 16, 30, 160, 201));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchmove, 3, canvas, 115, 30, 250, 210));
        interaction.processEvent(createTouchEvent(EventRegistrationToken.Touchend, 3, canvas, 115, 30, 250, 210));

        expect(handler.fsmStarts).toHaveBeenCalledTimes(1);
        expect(handler.fsmStops).toHaveBeenCalledTimes(1);
        expect(handler.fsmCancels).not.toHaveBeenCalled();

        expect(data.srcClientX).toBe(150);
        expect(data.srcClientY).toBe(200);
        expect(data.srcScreenX).toBe(15);
        expect(data.srcScreenY).toBe(20);
        expect(data.tgtClientX).toBe(250);
        expect(data.tgtClientY).toBe(210);
        expect(data.tgtScreenX).toBe(115);
        expect(data.tgtScreenY).toBe(30);
        expect(data.touchID).toBe(3);
        expect(data.button).toBeUndefined();
        expect(data.tgtObject).toBe(canvas);
    });
});

