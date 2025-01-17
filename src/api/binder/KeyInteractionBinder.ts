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
import type {InteractionData} from "../interaction/InteractionData";
import type {KeyInteractionBinderBuilder} from "./KeyInteractionBinderBuilder";
import type {LogLevel} from "../logging/LogLevel";
import type {Command} from "../command/Command";
import type {KeyInteractionCmdBinder} from "./KeyInteractionCmdBinder";
import type {Interaction} from "../interaction/Interaction";
import type {Widget} from "./BaseBinderBuilder";

export interface KeyInteractionBinder<I extends Interaction<D>, D extends InteractionData>
    extends KeyInteractionBinderBuilder<I, D> {

    when(fn: (i: D) => boolean): KeyInteractionBinder<I, D>;

    on(widget: ReadonlyArray<Widget<EventTarget>> | Widget<EventTarget>, ...widgets: ReadonlyArray<Widget<EventTarget>>): KeyInteractionBinder<I, D>;

    onDynamic(node: Widget<Node>): KeyInteractionBinder<I, D>;

    log(...level: ReadonlyArray<LogLevel>): KeyInteractionBinder<I, D>;

    end(fn: () => void): KeyInteractionBinder<I, D>;

    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionBinder<I, D>;

    stopImmediatePropagation(): KeyInteractionBinder<I, D>;

    preventDefault(): KeyInteractionBinder<I, D>;

    catch(fn: (ex: unknown) => void): KeyInteractionBinder<I, D>;

    name(name: string): KeyInteractionBinder<I, D>;

    toProduce<C extends Command>(fn: (i: D) => C): KeyInteractionCmdBinder<C, I, D>;
}
