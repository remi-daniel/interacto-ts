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

import type {FSMDataHandler} from "../../fsm/FSMDataHandler";
import {TerminalState} from "../../fsm/TerminalState";
import {MouseDownTransition} from "../../fsm/MouseDownTransition";
import type {PointData} from "../../../api/interaction/PointData";
import {FSMImpl} from "../../fsm/FSMImpl";
import {InteractionBase} from "../InteractionBase";
import {PointDataImpl} from "../PointDataImpl";

export class MouseDownFSM extends FSMImpl {
    public override buildFSM(dataHandler?: MouseDownFSMHandler): void {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed: TerminalState = new TerminalState(this, "pressed");
        this.addState(pressed);

        const pressure = new MouseDownTransition(this.initState, pressed);
        pressure.action = (event: MouseEvent): void => {
            dataHandler?.initToPress(event);
        };
    }
}

interface MouseDownFSMHandler extends FSMDataHandler {
    initToPress(event: MouseEvent): void;
}

/**
 * A user interaction for pressing down a mouse button.
 */
export class MouseDown extends InteractionBase<PointData, PointDataImpl, MouseDownFSM> {
    /**
     * Creates the interaction.
     */
    private readonly handler: MouseDownFSMHandler;

    public constructor() {
        super(new MouseDownFSM(), new PointDataImpl());

        this.handler = {
            "initToPress": (evt: MouseEvent): void => {
                this._data.copy(evt);
            },
            "reinitData": (): void => {
                this.reinitData();
            }
        };

        this.fsm.buildFSM(this.handler);
    }
}
