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

import type {OutputState} from "../../src/api/fsm/OutputState";
import type {MockProxy} from "jest-mock-extended";
import {mock} from "jest-mock-extended";
import type {InputState} from "../../src/api/fsm/InputState";
import {createEventWithTarget} from "../interaction/StubEvents";
import {ButtonPressedTransition} from "../../src/impl/fsm/ButtonPressedTransition";

let tr: ButtonPressedTransition;
let src: MockProxy<OutputState> & OutputState;
let tgt: InputState & MockProxy<InputState>;
let evt: Event;

beforeEach(() => {
    src = mock<OutputState>();
    tgt = mock<InputState>();
    evt = mock<Event>();
    tr = new ButtonPressedTransition(src, tgt);
});

test("that getAcceptedEvents works", () => {
    expect(tr.getAcceptedEvents()).toStrictEqual(["click", "auxclick"]);
});

test("that accept KO null target", () => {
    expect(tr.accept(evt)).toBeFalsy();
});

test("that accept KO target not button", () => {
    expect(tr.accept(createEventWithTarget(mock<HTMLInputElement>(), "input"))).toBeFalsy();
});

test("that accept OK", () => {
    expect(tr.accept(createEventWithTarget(document.createElement("button"), "input"))).toBeTruthy();
});

