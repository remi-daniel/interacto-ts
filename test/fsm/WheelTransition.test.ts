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

import type {FSMImpl} from "../../src/impl/fsm/FSMImpl";
import {StdState} from "../../src/impl/fsm/StdState";
import {createMouseEvent, createTouchEvent, createWheelEvent} from "../interaction/StubEvents";
import {mock} from "jest-mock-extended";
import {WheelTransition} from "../../src/impl/fsm/WheelTransition";

let tr: WheelTransition;
let canvas: HTMLCanvasElement;

beforeEach(() => {
    tr = new WheelTransition(new StdState(mock<FSMImpl>(), "a"), new StdState(mock<FSMImpl>(), "b"));
    canvas = document.createElement("canvas");
});

test("invalid mouse event", () => {
    expect(tr.accept(createMouseEvent("mousedown", canvas,
        11, 23, 11, 23, 0))).toBeFalsy();
});

test("invalid event type", () => {
    expect(tr.accept(createTouchEvent("touchend", 3,
        canvas, 11, 23, 12, 25))).toBeFalsy();
});

test("valid event", () => {
    expect(tr.accept(createWheelEvent("wheel",
        canvas, 11, 43, 12, 11, 1,
        5, 6, 7, 8))).toBeTruthy();
});

test("guard OK", () => {
    expect(tr.isGuardOK(createWheelEvent("wheel",
        canvas, 11, 43, 12, 11, 1,
        5, 6, 7, 8))).toBeTruthy();
});

test("accepted events", () => {
    expect(tr.getAcceptedEvents()).toStrictEqual(["wheel"]);
});
