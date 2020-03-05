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

import { State } from "./State";
import { FSM } from "./FSM";

/**
 * The base implementation of the State interface.
 * @param <E> The type of events the FSM processes.
 */
export abstract class StateImpl implements State {
    protected readonly fsm: FSM;

    protected readonly name: string;

    protected constructor(stateMachine: FSM, stateName: string) {
        this.fsm = stateMachine;
        this.name = stateName;
    }

    public checkStartingState(): void {
        if (!this.fsm.isStarted() && this.fsm.getStartingState() === this) {
            this.fsm.onStarting();
        }
    }

    /**
     *
     * @return {string}
     */
    public getName(): string {
        return this.name;
    }

    /**
     *
     * @return {FSM}
     */
    public getFSM(): FSM {
        return this.fsm;
    }

    public uninstall(): void {
    }
}
