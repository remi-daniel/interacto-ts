/*
 * This file is part of Interacto.
 * Interacto is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General export function License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * Interacto is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General export function License for more details.
 * You should have received a copy of the GNU General export function License
 * along with Interacto.  If not, see <https://www.gnu.org/licenses/>.
 */

import {InteractionBinder} from "../binder/InteractionBinder";
import {ButtonPressed} from "../../impl/interaction/library/ButtonPressed";
import {WidgetData} from "../interaction/WidgetData";
import {UpdateBinder} from "../../impl/binder/UpdateBinder";
import {BoxChecked} from "../../impl/interaction/library/BoxChecked";
import {ColorPicked} from "../../impl/interaction/library/ColorPicked";
import {ComboBoxSelected} from "../../impl/interaction/library/ComboBoxSelected";
import {SpinnerChanged} from "../../impl/interaction/library/SpinnerChanged";
import {InteractionUpdateBinder} from "../binder/InteractionUpdateBinder";
import {DatePicked} from "../../impl/interaction/library/DatePicked";
import {Interaction} from "../interaction/Interaction";
import {InteractionData} from "../interaction/InteractionData";
import {CommandBase} from "../../impl/command/CommandBase";
import {BaseUpdateBinder} from "../binder/BaseUpdateBinder";
import {BindingsObserver} from "./BindingsObserver";
import {TextInputChanged} from "../../impl/interaction/library/TextInputChanged";
import {MultiTouch} from "../../impl/interaction/library/MultiTouch";
import {MultiTouchData} from "../interaction/MultiTouchData";
import {Tap} from "../../impl/interaction/library/Tap";
import {TapData} from "../interaction/TapData";
import {LongTouch} from "../../impl/interaction/library/LongTouch";
import {TouchData} from "../interaction/TouchData";
import {Swipe} from "../../impl/interaction/library/Swipe";
import {SrcTgtTouchData} from "../interaction/SrcTgtTouchData";
import {Pan} from "../../impl/interaction/library/Pan";
import {Click} from "../../impl/interaction/library/Click";
import {PointData} from "../interaction/PointData";
import {Press} from "../../impl/interaction/library/Press";
import {DnD} from "../../impl/interaction/library/DnD";
import {SrcTgtPointsData} from "../interaction/SrcTgtPointsData";
import {DoubleClick} from "../../impl/interaction/library/DoubleClick";
import {DragLock} from "../../impl/interaction/library/DragLock";
import {HyperLinkClicked} from "../../impl/interaction/library/HyperLinkClicked";
import {KeyPressed} from "../../impl/interaction/library/KeyPressed";
import {KeyData} from "../interaction/KeyData";
import {KeysData} from "../interaction/KeysData";
import {KeysPressed} from "../../impl/interaction/library/KeysPressed";
import {KeysTyped} from "../../impl/interaction/library/KeysTyped";
import {KeyTyped} from "../../impl/interaction/library/KeyTyped";
import {Scroll} from "../../impl/interaction/library/Scroll";
import {ScrollData} from "../interaction/ScrollData";
import {KeyInteractionBinder} from "../binder/KeyInteractionBinder";
import {KeysBinder} from "../../impl/binder/KeysBinder";
import {KeyInteractionUpdateBinder} from "../binder/KeyInteractionUpdateBinder";
import {TouchDnD} from "../../impl/interaction/library/TouchDnD";
import {LongPress} from "../../impl/interaction/library/LongPress";
import {Clicks} from "../../impl/interaction/library/Clicks";
import {PointsData} from "../interaction/PointsData";
import {Widget} from "../binder/BaseBinderBuilder";
import {Undo} from "../../impl/command/library/Undo";
import {Binding} from "./Binding";
import {Redo} from "../../impl/command/library/Redo";

/**
 * The global `BindingsObserver` object. To be used to monitor bindings created using the routines of this file.
 */
let observer: BindingsObserver | undefined;

/**
 * Clears the current global `BindingsObserver` object. Nothing is done if this objects is undefined.
 */
export function clearBindingObserver(): void {
    observer?.clearObservedBindings();
}

/**
 * Sets the global `BindingsObserver` object. Cleans the potential former global `BindingsObserver` object.
 * @param obs - The new `BindingsObserver` object to consider. Can be undefined.
 */
export function setBindingObserver(obs: BindingsObserver): void {
    clearBindingObserver();
    observer = obs;
}


export function nodeBinder(): BaseUpdateBinder {
    return new UpdateBinder<CommandBase, Interaction<InteractionData>, InteractionData>(observer) as BaseUpdateBinder;
}

/**
 * Creates binding builder to build a binding between a button interaction and the given command type.
 * Do not forget to call bind() at the end of the build to execute the builder.
 * @returns The binding builder.
 */
export function buttonBinder(): InteractionBinder<Interaction<WidgetData<HTMLButtonElement>>, WidgetData<HTMLButtonElement>> {
    return new UpdateBinder(observer)
        .usingInteraction<ButtonPressed, WidgetData<HTMLButtonElement>>(() => new ButtonPressed());
}

export function checkboxBinder(): InteractionBinder<Interaction<WidgetData<HTMLInputElement>>, WidgetData<HTMLInputElement>> {
    return new UpdateBinder(observer)
        .usingInteraction<BoxChecked, WidgetData<HTMLInputElement>>(() => new BoxChecked());
}

export function colorPickerBinder(): InteractionBinder<Interaction<WidgetData<HTMLInputElement>>, WidgetData<HTMLInputElement>> {
    return new UpdateBinder(observer)
        .usingInteraction<ColorPicked, WidgetData<HTMLInputElement>>(() => new ColorPicked());
}

export function comboBoxBinder(): InteractionBinder<Interaction<WidgetData<HTMLSelectElement>>, WidgetData<HTMLSelectElement>> {
    return new UpdateBinder(observer)
        .usingInteraction<ComboBoxSelected, WidgetData<HTMLSelectElement>>(() => new ComboBoxSelected());
}

export function spinnerBinder(): InteractionUpdateBinder<Interaction<WidgetData<HTMLInputElement>>, WidgetData<HTMLInputElement>> {
    return new UpdateBinder(observer)
        .usingInteraction<SpinnerChanged, WidgetData<HTMLInputElement>>(() => new SpinnerChanged());
}

export function dateBinder(): InteractionBinder<Interaction<WidgetData<HTMLInputElement>>, WidgetData<HTMLInputElement>> {
    return new UpdateBinder(observer)
        .usingInteraction<DatePicked, WidgetData<HTMLInputElement>>(() => new DatePicked());
}

export function hyperlinkBinder(): InteractionBinder<Interaction<WidgetData<HTMLAnchorElement>>, WidgetData<HTMLAnchorElement>> {
    return new UpdateBinder(observer)
        .usingInteraction<HyperLinkClicked, WidgetData<HTMLAnchorElement>>(() => new HyperLinkClicked());
}

/**
 * Creates a binding that uses a text interaction. This binder takes as argument a timeout value:
 * using this text writing interaction, a user can write a sequence of letters and then stops for
 * more than x milliseconds (x is the value of timeout). After this delay the binding executes the command.
 * This is a mainstream optimisation that many text processing tools implement to limit the number of editing actions.
 * @param timeout - The timeout in milliseconds after which the interaction stops and the command produced.
 */
export function textInputBinder(timeout?: number): InteractionUpdateBinder<Interaction<WidgetData<HTMLInputElement | HTMLTextAreaElement>>,
WidgetData<HTMLInputElement | HTMLTextAreaElement>> {
    return new UpdateBinder(observer)
        .usingInteraction<TextInputChanged, WidgetData<HTMLInputElement | HTMLTextAreaElement>>(() => new TextInputChanged(timeout));
}

/**
 * Creates a binding that uses the touch DnD interaction (a DnD interaction that uses one touch).
 * This interaction works as a Drag-and-Drop interaction.
 */
export function touchDnDBinder(): InteractionUpdateBinder<Interaction<SrcTgtTouchData>, SrcTgtTouchData> {
    return new UpdateBinder(observer)
        .usingInteraction<TouchDnD, SrcTgtTouchData>(() => new TouchDnD());
}

/**
 * Creates a binding that uses the multi-touch user interaction.
 * @param nbTouches - The number of required touches.
 * A multi-touch starts when all its touches have started.
 * A multi-touch ends when the number of required touches is greater than the number of touches.
 */
export function multiTouchBinder(nbTouches: number): InteractionUpdateBinder<Interaction<MultiTouchData>, MultiTouchData> {
    return new UpdateBinder(observer)
        .usingInteraction<MultiTouch, MultiTouchData>(() => new MultiTouch(nbTouches));
}

/**
 * Creates a binding that uses the tap user interaction.
 * @param nbTap - The number of required taps.
 * If this number is not reached after a timeout, the interaction is cancelled.
 */
export function tapBinder(nbTap: number): InteractionUpdateBinder<Interaction<TapData>, TapData> {
    return new UpdateBinder(observer)
        .usingInteraction<Tap, TapData>(() => new Tap(nbTap));
}

/**
 * Creates a binding that uses the long touch interaction.
 * @param duration - The duration of the touch to end the user interaction.
 * If this duration is not reached, the interaction is cancelled.
 */
export function longTouchBinder(duration: number): InteractionUpdateBinder<Interaction<TouchData>, TouchData> {
    return new UpdateBinder(observer)
        .usingInteraction<LongTouch, TouchData>(() => new LongTouch(duration));
}

/**
 * Creates a binding that uses the swipe interaction.
 * If this velocity is not reached, the interaction is cancelled.
 * @param horizontal - Defines whether the swipe is horizontal or vertical
 * @param minVelocity - The minimal minVelocity to reach for validating the swipe. In pixels per second.
 * @param minLength - The minimal distance from the starting point to the release point for validating the swipe
 * @param pxTolerance - The tolerance rate in pixels accepted while executing the swipe
 */
export function swipeBinder(horizontal: boolean, minVelocity: number, minLength: number, pxTolerance: number):
InteractionUpdateBinder<Interaction<SrcTgtTouchData>, SrcTgtTouchData> {
    return new UpdateBinder(observer)
        .usingInteraction<Swipe, SrcTgtTouchData>(() => new Swipe(horizontal, minVelocity, minLength, pxTolerance));
}

/**
 * Creates a binding that uses the pan interaction.
 * @param horizontal - Defines whether the pan is horizontal or vertical
 * @param minLength - The minimal distance from the starting point to the release point for validating the pan
 * @param pxTolerance - The tolerance rate in pixels accepted while executing the pan
 */
export function panBinder(horizontal: boolean, minLength: number, pxTolerance: number):
InteractionUpdateBinder<Interaction<SrcTgtTouchData>, SrcTgtTouchData> {
    return new UpdateBinder(observer)
        .usingInteraction<Pan, SrcTgtTouchData>(() => new Pan(horizontal, minLength, pxTolerance));
}

/**
 * Creates a binding that uses the click interaction.
 */
export function clickBinder(): InteractionBinder<Interaction<PointData>, PointData> {
    return new UpdateBinder(observer)
        .usingInteraction<Click, PointData>(() => new Click());
}

/**
 * Creates a binding that uses the double click interaction.
 */
export function dbleClickBinder(): InteractionUpdateBinder<Interaction<PointData>, PointData> {
    return new UpdateBinder(observer)
        .usingInteraction<DoubleClick, PointData>(() => new DoubleClick());
}

/**
 * Creates a binding that uses the mouse press interaction.
 */
export function pressBinder(): InteractionBinder<Interaction<PointData>, PointData> {
    return new UpdateBinder(observer)
        .usingInteraction<Press, PointData>(() => new Press());
}

/**
 * Creates a binding that uses the long press interaction.
 * @param duration - The duration of the pressure to end the user interaction.
 * If this duration is not reached, the interaction is cancelled.
 */
export function longPressBinder(duration: number): InteractionUpdateBinder<Interaction<PointData>, PointData> {
    return new UpdateBinder(observer)
        .usingInteraction<LongPress, PointData>(() => new LongPress(duration));
}

/**
 * Creates a binding for clicking n times.
 * @param nbClicks - The number of clicks to do.
 * If this number is not reached, the interaction is cancelled after a timeout of 1s.
 */
export function clicksBinder(nbClicks: number): InteractionUpdateBinder<Interaction<PointsData>, PointsData> {
    return new UpdateBinder(observer)
        .usingInteraction<Clicks, PointsData>(() => new Clicks(nbClicks));
}

/**
 * Creates a binding that uses the mouse scroll interaction.
 */
export function scrollBinder(): InteractionBinder<Interaction<ScrollData>, ScrollData> {
    return new UpdateBinder(observer)
        .usingInteraction<Scroll, ScrollData>(() => new Scroll());
}

/**
 * Creates a binding that uses the DnD interaction.
 * @param cancellable - True: the escape key will cancels the DnD.
 */
export function dndBinder(cancellable: boolean): InteractionUpdateBinder<Interaction<SrcTgtPointsData>, SrcTgtPointsData> {
    return new UpdateBinder(observer)
        .usingInteraction<DnD, SrcTgtPointsData>(() => new DnD(cancellable));
}

/**
 * Creates a binding that uses the drag lock interaction.
 */
export function dragLockBinder(): InteractionUpdateBinder<Interaction<SrcTgtPointsData>, SrcTgtPointsData> {
    return new UpdateBinder(observer)
        .usingInteraction<DragLock, SrcTgtPointsData>(() => new DragLock());
}

/**
 * Creates a binding that uses the key pressure interaction.
 * @param modifierAccepted - True: the interaction will consider key modifiers.
 */
export function keyPressBinder(modifierAccepted: boolean): KeyInteractionBinder<Interaction<KeyData>, KeyData> {
    return new KeysBinder(observer)
        .usingInteraction<KeyPressed, KeyData>(() => new KeyPressed(modifierAccepted));
}

/**
 * Creates a binding that uses the multiple key pressures interaction.
 */
export function keysPressBinder(): KeyInteractionUpdateBinder<Interaction<KeysData>, KeysData> {
    return new KeysBinder(observer)
        .usingInteraction<KeysPressed, KeysData>(() => new KeysPressed());
}

/**
 * Creates a binding that uses the multiple key typings interaction.
 */
export function keysTypeBinder(): KeyInteractionUpdateBinder<Interaction<KeysData>, KeysData> {
    return new KeysBinder(observer)
        .usingInteraction<KeysTyped, KeysData>(() => new KeysTyped());
}

/**
 * Creates a binding that uses the key typing interaction.
 */
export function keyTypeBinder(): KeyInteractionBinder<Interaction<KeyData>, KeyData> {
    return new KeysBinder(observer)
        .usingInteraction<KeyTyped, KeyData>(() => new KeyTyped());
}

/**
 * Creates two bindings for undo and redo operations with buttons.
 * @param undo - The undo button
 * @param redo - The redo button
 */
export function undoRedoBinder(undo: Widget<HTMLButtonElement>, redo: Widget<HTMLButtonElement>):
[Binding<Undo, Interaction<WidgetData<HTMLButtonElement>>, WidgetData<HTMLButtonElement>>,
    Binding<Redo, Interaction<WidgetData<HTMLButtonElement>>, WidgetData<HTMLButtonElement>>] {
    return [
        buttonBinder()
            .on(undo)
            .toProduce(() => new Undo())
            .bind(),
        buttonBinder()
            .on(redo)
            .toProduce(() => new Redo())
            .bind()
    ];
}
