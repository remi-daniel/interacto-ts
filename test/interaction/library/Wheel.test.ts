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

import type {FSMHandler} from "../../../src/interacto";
import {createWheelEvent2, robot} from "../StubEvents";
import type {MockProxy} from "jest-mock-extended";
import {mock} from "jest-mock-extended";
import {Wheel} from "../../../src/impl/interaction/library/Wheel";
import {WheelDataImpl} from "../../../src/impl/interaction/WheelDataImpl";

let interaction: Wheel;
let canvas: HTMLElement;
let handler: FSMHandler & MockProxy<FSMHandler>;

beforeEach(() => {
    handler = mock<FSMHandler>();
    interaction = new Wheel();
    interaction.log(true);
    interaction.fsm.log = true;
    interaction.fsm.addHandler(handler);
    canvas = document.createElement("canvas");
});

test("build fsm twice does not work", () => {
    const count = interaction.fsm.states.length;
    interaction.fsm.buildFSM();
    expect(interaction.fsm.states).toHaveLength(count);
});

test("wheel event on a element starts and stops the Wheel interaction", () => {
    interaction.registerToNodes([canvas]);
    robot().wheel(canvas);
    expect(handler.fsmStarts).toHaveBeenCalledTimes(1);
    expect(handler.fsmStops).toHaveBeenCalledTimes(1);
});

test("other event don't trigger the interaction.", () => {
    interaction.registerToNodes([canvas]);
    robot().input(canvas);
    expect(handler.fsmStarts).not.toHaveBeenCalled();
});

test("testWheelData", () => {
    const data = new WheelDataImpl();
    const expected = new WheelDataImpl();
    expected.copy({
        "altKey": true,
        "button": 1,
        "buttons": 0,
        "clientX": 11,
        "clientY": 22,
        "ctrlKey": false,
        "currentTarget": canvas,
        "metaKey": true,
        "movementX": 10,
        "movementY": 20,
        "offsetX": 30,
        "offsetY": 40,
        "pageX": 50,
        "pageY": 60,
        "relatedTarget": canvas,
        "screenX": 111,
        "screenY": 222,
        "shiftKey": true,
        "target": canvas,
        "timeStamp": 0,
        "deltaX": 18,
        "deltaY": 19,
        "deltaZ": 20,
        "deltaMode": 21
    });

    handler.fsmStops.mockImplementation(() => {
        data.copy(interaction.data);
    });
    interaction.processEvent(createWheelEvent2("wheel", expected));
    expect(data).toStrictEqual(expected);
});

test("testWheelOnWidgetData", () => {
    const data = new WheelDataImpl();

    handler.fsmStops.mockImplementation(() => {
        data.copy(interaction.data);
    });
    interaction.registerToNodes([canvas]);
    robot().wheel({"target": canvas, "button": 1, "screenX": 111, "screenY": 222, "clientX": 11, "clientY": 22,
        "deltaX": 18, "deltaY": 19, "deltaZ": 20, "deltaMode": 21});
    expect(data.clientX).toStrictEqual(11);
    expect(data.clientY).toStrictEqual(22);
    expect(data.screenX).toStrictEqual(111);
    expect(data.screenY).toStrictEqual(222);
    expect(data.button).toStrictEqual(1);
    expect(data.deltaX).toStrictEqual(18);
    expect(data.deltaY).toStrictEqual(19);
    expect(data.deltaZ).toStrictEqual(20);
    expect(data.deltaMode).toStrictEqual(21);
});

