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

import {BoxChecked, FSMHandler} from "../../../src/interacto";
import {mock} from "jest-mock-extended";

let interaction: BoxChecked;
let boxCheck: HTMLElement;
let handler: FSMHandler;

beforeEach(() => {
    jest.clearAllMocks();
    handler = mock<FSMHandler>();
    interaction = new BoxChecked();
    interaction.log(true);
    interaction.getFsm().log(true);
    interaction.getFsm().addHandler(handler);
    document.documentElement.innerHTML = "<html><div><input id='bc1' type='checkbox'></div></html>";
    boxCheck = document.getElementById("bc1") as HTMLElement;
});

test("click event start and stop the interaction CheckBox", () => {
    interaction.registerToNodes([boxCheck]);
    boxCheck.click();
    expect(handler.fsmStops).toHaveBeenCalledTimes(1);
    expect(handler.fsmStarts).toHaveBeenCalledTimes(1);
});

test("input event trigger the interaction CheckBox", () => {
    interaction.registerToNodes([boxCheck]);
    boxCheck.dispatchEvent(new Event("input"));
    expect(handler.fsmStarts).toHaveBeenCalledTimes(1);
    expect(handler.fsmStops).toHaveBeenCalledTimes(1);
});

test("other event don't trigger the interaction CheckBox", () => {
    interaction.registerToNodes([boxCheck]);
    boxCheck.dispatchEvent(new Event("change"));
    boxCheck.dispatchEvent(new Event("update"));
    expect(handler.fsmStarts).not.toHaveBeenCalled();
});
