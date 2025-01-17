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

import {ButtonPressed} from "../interaction/library/ButtonPressed";
import type {WidgetData} from "../../api/interaction/WidgetData";
import {UpdateBinder} from "../binder/UpdateBinder";
import {BoxChecked} from "../interaction/library/BoxChecked";
import {ColorPicked} from "../interaction/library/ColorPicked";
import {ComboBoxSelected} from "../interaction/library/ComboBoxSelected";
import {SpinnerChanged} from "../interaction/library/SpinnerChanged";
import {DatePicked} from "../interaction/library/DatePicked";
import type {Interaction} from "../../api/interaction/Interaction";
import type {InteractionData} from "../../api/interaction/InteractionData";
import type {CommandBase} from "../command/CommandBase";
import type {BaseUpdateBinder} from "../../api/binder/BaseUpdateBinder";
import type {BindingsObserver} from "../../api/binding/BindingsObserver";
import {TextInputChanged} from "../interaction/library/TextInputChanged";
import {MultiTouch} from "../interaction/library/MultiTouch";
import type {MultiTouchData} from "../../api/interaction/MultiTouchData";
import {Tap} from "../interaction/library/Tap";
import type {TapData} from "../../api/interaction/TapData";
import {LongTouch} from "../interaction/library/LongTouch";
import type {TouchData} from "../../api/interaction/TouchData";
import {Click} from "../interaction/library/Click";
import type {PointData} from "../../api/interaction/PointData";
import {MouseDown} from "../interaction/library/MouseDown";
import {DnD} from "../interaction/library/DnD";
import type {SrcTgtPointsData} from "../../api/interaction/SrcTgtPointsData";
import {DoubleClick} from "../interaction/library/DoubleClick";
import {DragLock} from "../interaction/library/DragLock";
import {HyperLinkClicked} from "../interaction/library/HyperLinkClicked";
import {KeyDown} from "../interaction/library/KeyDown";
import type {KeyData} from "../../api/interaction/KeyData";
import type {KeysData} from "../../api/interaction/KeysData";
import {KeysDown} from "../interaction/library/KeysDown";
import {KeysTyped} from "../interaction/library/KeysTyped";
import {KeyTyped} from "../interaction/library/KeyTyped";
import {Scroll} from "../interaction/library/Scroll";
import type {ScrollData} from "../../api/interaction/ScrollData";
import {KeysBinder} from "../binder/KeysBinder";
import {TouchDnD} from "../interaction/library/TouchDnD";
import {LongMouseDown} from "../interaction/library/LongMouseDown";
import {Clicks} from "../interaction/library/Clicks";
import {MouseLeave} from "../interaction/library/MouseLeave";
import {MouseEnter} from "../interaction/library/MouseEnter";
import {MouseMove} from "../interaction/library/MouseMove";
import type {PointsData} from "../../api/interaction/PointsData";
import type {EltRef, Widget} from "../../api/binder/BaseBinderBuilder";
import {Undo} from "../command/library/Undo";
import type {Binding} from "../../api/binding/Binding";
import {Redo} from "../command/library/Redo";
import type {
    PartialAnchorBinder,
    PartialButtonBinder,
    PartialInputBinder,
    PartialKeyBinder,
    PartialKeysBinder,
    PartialMultiTouchBinder,
    PartialPointBinder,
    PartialPointsBinder,
    PartialPointSrcTgtBinder,
    PartialScrollBinder,
    PartialSelectBinder,
    PartialSpinnerBinder,
    PartialTapBinder,
    PartialTextInputBinder,
    PartialTouchBinder,
    PartialTouchSrcTgtBinder,
    PartialUpdatePointBinder, PartialWheelBinder
} from "../../api/binding/Bindings";
import type {UndoHistory} from "../../api/undo/UndoHistory";
import {UndoHistoryImpl} from "../undo/UndoHistoryImpl";
import {Bindings} from "../../api/binding/Bindings";
import type {Logger} from "../../api/logging/Logger";
import {LoggerImpl} from "../logging/LoggerImpl";
import type {WheelData} from "../../api/interaction/WheelData";
import {Wheel} from "../interaction/library/Wheel";
import {KeyUp} from "../interaction/library/KeyUp";
import {MouseUp} from "../interaction/library/MouseUp";
import Timeout = NodeJS.Timeout;

export class BindingsImpl extends Bindings {
    private observer: BindingsObserver | undefined;

    private readonly undoHistoryData: UndoHistory;

    public readonly logger: Logger;

    public constructor(history?: UndoHistory, logger?: Logger) {
        super();
        this.undoHistoryData = history ?? new UndoHistoryImpl();
        this.logger = logger ?? new LoggerImpl();
    }

    public get undoHistory(): UndoHistory {
        return this.undoHistoryData;
    }

    public nodeBinder(): BaseUpdateBinder {
        return new UpdateBinder<CommandBase, Interaction<InteractionData>, InteractionData>(this.undoHistory,
            this.logger, this.observer) as BaseUpdateBinder;
    }

    public buttonBinder(): PartialButtonBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<ButtonPressed, WidgetData<HTMLButtonElement>>(() => new ButtonPressed());
    }

    public checkboxBinder(): PartialInputBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<BoxChecked, WidgetData<HTMLInputElement>>(() => new BoxChecked());
    }

    public colorPickerBinder(): PartialInputBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<ColorPicked, WidgetData<HTMLInputElement>>(() => new ColorPicked());
    }

    public comboBoxBinder(): PartialSelectBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<ComboBoxSelected, WidgetData<HTMLSelectElement>>(() => new ComboBoxSelected());
    }

    public spinnerBinder(): PartialSpinnerBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<SpinnerChanged, WidgetData<HTMLInputElement>>(() => new SpinnerChanged());
    }

    public dateBinder(): PartialInputBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<DatePicked, WidgetData<HTMLInputElement>>(() => new DatePicked());
    }

    public hyperlinkBinder(): PartialAnchorBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<HyperLinkClicked, WidgetData<HTMLAnchorElement>>(() => new HyperLinkClicked());
    }

    public textInputBinder(timeout?: number): PartialTextInputBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<TextInputChanged, WidgetData<HTMLInputElement | HTMLTextAreaElement>>(() => new TextInputChanged(timeout));
    }

    public touchDnDBinder(cancellable: boolean): PartialTouchSrcTgtBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<TouchDnD, SrcTgtPointsData<TouchData>>(() => new TouchDnD(cancellable));
    }

    /**
     * Creates a binding that uses the multi-touch user interaction.
     * @param nbTouches - The number of required touches.
     * A multi-touch starts when all its touches have started.
     * A multi-touch ends when the number of required touches is greater than the number of touches.
     */
    public multiTouchBinder(nbTouches: number): PartialMultiTouchBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<MultiTouch, MultiTouchData>(() => new MultiTouch(nbTouches));
    }

    /**
     * Creates a binding that uses the tap user interaction.
     * @param nbTap - The number of required taps.
     * If this number is not reached after a timeout, the interaction is cancelled.
     */
    public tapBinder(nbTap: number): PartialTapBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<Tap, TapData>(() => new Tap(nbTap));
    }

    /**
     * Creates a binding that uses the long touch interaction.
     * @param duration - The duration of the touch to end the user interaction.
     * If this duration is not reached, the interaction is cancelled.
     */
    public longTouchBinder(duration: number): PartialTouchBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<LongTouch, TouchData>(() => new LongTouch(duration));
    }

    /**
     * Creates a binding that uses the swipe interaction.
     * If this velocity is not reached, the interaction is cancelled.
     * @param horizontal - Defines whether the swipe is horizontal or vertical
     * @param minVelocity - The minimal minVelocity to reach for validating the swipe. In pixels per second.
     * @param minLength - The minimal distance from the starting point to the release point for validating the swipe
     * @param nbTouches - The number of touches required to start the interaction
     * @param pxTolerance - The tolerance rate in pixels accepted while executing the swipe
     */
    public swipeBinder(horizontal: boolean, minVelocity: number, minLength: number, nbTouches: number, pxTolerance: number): PartialMultiTouchBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<MultiTouch, MultiTouchData>(() => new MultiTouch(nbTouches))
            .when(i => (horizontal ? i.isHorizontal(pxTolerance) : i.isVertical(pxTolerance)))
            .when(i => (horizontal ? Math.abs(i.touches[0].diffScreenX) >= minLength : Math.abs(i.touches[0].diffScreenY) >= minLength))
            // The velocity value is in pixels/ms, so conversion is necessary
            .when(i => i.touches[0].velocity * 1000 >= minVelocity);
    }

    /**
     * Creates a binding that uses the pan interaction.
     * @param horizontal - Defines whether the pan is horizontal or vertical
     * @param minLength - The minimal distance from the starting point to the release point for validating the pan
     * @param nbTouches - The number of touches required to start the interaction
     * @param pxTolerance - The tolerance rate in pixels accepted while executing the pan
     */
    public panBinder(horizontal: boolean, minLength: number, nbTouches: number, pxTolerance: number): PartialMultiTouchBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<MultiTouch, MultiTouchData>(() => new MultiTouch(nbTouches))
            .when(i => (horizontal ? i.isHorizontal(pxTolerance) : i.isVertical(pxTolerance)))
            .when(i => (horizontal ? Math.abs(i.touches[0].diffScreenX) >= minLength : Math.abs(i.touches[0].diffScreenY) >= minLength));
    }

    /**
     * Creates a binding that uses the pinch interaction.
     * @param pxTolerance - The tolerance rate in pixels accepted while executing the pinch
     */
    public pinchBinder(pxTolerance: number): PartialMultiTouchBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<MultiTouch, MultiTouchData>(() => new MultiTouch(2))
            .when(i => i.pinchFactor(pxTolerance) !== undefined);
    }

    /**
     * Creates a binding that uses the click interaction.
     */
    public clickBinder(): PartialPointBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<Click, PointData>(() => new Click());
    }

    /**
     * Creates a binding that uses the double click interaction.
     */
    public dbleClickBinder(): PartialUpdatePointBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<DoubleClick, PointData>(() => new DoubleClick());
    }

    /**
     * Creates a binding that uses the MouseUp (mouse button released) interaction.
     */
    public mouseUpBinder(): PartialPointBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<MouseUp, PointData>(() => new MouseUp());
    }

    /**
     * Creates a binding that uses the MouseDown (mouse button pressed) interaction.
     */
    public mouseDownBinder(): PartialPointBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<MouseDown, PointData>(() => new MouseDown());
    }

    /**
     * Creates a binding that uses the LongMouseDown
     * (mouse button pressed for a certain amount of time) interaction.
     * @param duration - The duration of the pressure to end the user interaction.
     * If this duration is not reached, the interaction is cancelled.
     */
    public longMouseDownBinder(duration: number): PartialUpdatePointBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<LongMouseDown, PointData>(() => new LongMouseDown(duration));
    }

    /**
     * Creates a binding for clicking n times.
     * @param nbClicks - The number of clicks to do.
     * If this number is not reached, the interaction is cancelled after a timeout of 1s.
     */
    public clicksBinder(nbClicks: number): PartialPointsBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<Clicks, PointsData>(() => new Clicks(nbClicks));
    }

    /**
     * Creates a binding that uses the MouseLeave (mouse cursor leaves the element) interaction.
     * @param withBubbling - True: event bubbling is enabled and events on child elements will be registered
     */
    public mouseLeaveBinder(withBubbling: boolean): PartialPointBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<MouseLeave, PointData>(() => new MouseLeave(withBubbling));
    }

    /**
     * Creates a binding that uses the MouseEnter (mouse cursor enters the element) interaction.
     * @param withBubbling - True: event bubbling is enabled and events on child elements will be registered
     */
    public mouseEnterBinder(withBubbling: boolean): PartialPointBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<MouseEnter, PointData>(() => new MouseEnter(withBubbling));
    }

    /**
     * Creates a binding that uses the MouseMove (mouse cursor moves) interaction.
     */
    public mouseMoveBinder(): PartialPointBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<MouseMove, PointData>(() => new MouseMove());
    }

    /**
     * Creates a binding that uses the Wheel (user uses a mouse scrolling wheel) interaction.
     */
    public wheelBinder(): PartialWheelBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<Wheel, WheelData>(() => new Wheel());
    }

    /**
     * Creates a binding that uses the mouse scroll interaction.
     */
    public scrollBinder(): PartialScrollBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<Scroll, ScrollData>(() => new Scroll());
    }

    /**
     * Creates a binding that uses the DnD interaction.
     * @param cancellable - True: the escape key will cancel the DnD.
     */
    public dndBinder(cancellable: boolean): PartialPointSrcTgtBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<DnD, SrcTgtPointsData<PointData>>(() => new DnD(cancellable));
    }

    /**
     * Creates a binding that uses the Reciprocal DnD interaction.
     * A spring handle can be pressed on a long click to return the element back to its previous position.
     * @param handle - The selectable part of the spring widget.
     * @param spring - The line between the handle and the previous position of the element.
     */
    public reciprocalDndBinder(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>): PartialPointSrcTgtBinder {
        let displaySpring: boolean;
        let interval: Timeout;
        const radiusAttribute = handle.nativeElement.getAttribute("r");
        let radius: number;
        if (radiusAttribute !== null) {
            radius = parseInt(radiusAttribute, 10);
        }

        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<DnD, SrcTgtPointsData<PointData>>(() => new DnD(true))
            .on(handle)
            .then((c, i) => {
                // Management of the dwell and spring
                // The element to use for this interaction (handle) must have the "ioDwellSpring" class
                if (!displaySpring) {
                    clearInterval(interval);
                    interval = setInterval(() => {
                        clearInterval(interval);
                        displaySpring = true;
                        spring.nativeElement.setAttribute("display", "block");
                        handle.nativeElement.setAttribute("display", "block");
                        handle.nativeElement.setAttribute("cx", String(i.tgt.pageX - radius));
                        handle.nativeElement.setAttribute("cy", String(i.tgt.pageY));
                        spring.nativeElement.setAttribute("x1", String(i.src.pageX));
                        spring.nativeElement.setAttribute("y1", String(i.src.pageY));
                        spring.nativeElement.setAttribute("x2", String(i.tgt.pageX - radius));
                        spring.nativeElement.setAttribute("y2", String(i.tgt.pageY));

                        if (i.tgt.clientX < radius) {
                            handle.nativeElement.setAttribute("cx", String(radius));
                            spring.nativeElement.setAttribute("x2", String(radius));
                        }
                    }, 1000);
                }
            })
            .endOrCancel(() => {
                clearInterval(interval);
                displaySpring = false;
                spring.nativeElement.setAttribute("display", "none");
                handle.nativeElement.setAttribute("display", "none");
            });
    }

    /**
     * Creates a binding that uses the drag lock interaction.
     */
    public dragLockBinder(): PartialPointSrcTgtBinder {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<DragLock, SrcTgtPointsData<PointData>>(() => new DragLock());
    }

    /**
     * Creates a binding that uses the KeyUp (key released) interaction.
     * @param modifierAccepted - True: the interaction will consider key modifiers.
     */
    public keyUpBinder(modifierAccepted: boolean): PartialKeyBinder {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<KeyUp, KeyData>(() => new KeyUp(modifierAccepted));
    }

    /**
     * Creates a binding that uses the KeyDown (key pressed) interaction.
     * @param modifierAccepted - True: the interaction will consider key modifiers.
     */
    public keyDownBinder(modifierAccepted: boolean): PartialKeyBinder {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<KeyDown, KeyData>(() => new KeyDown(modifierAccepted));
    }

    /**
     * Creates a binding that uses the KeysDown (multiple keys pressed) interaction.
     */
    public keysDownBinder(): PartialKeysBinder {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<KeysDown, KeysData>(() => new KeysDown());
    }

    /**
     * Creates a binding that uses the KeysType (multiple keys pressed then released) interaction.
     */
    public keysTypeBinder(): PartialKeysBinder {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<KeysTyped, KeysData>(() => new KeysTyped());
    }

    /**
     * Creates a binding that uses the KeyTyped (key pressed then released) interaction.
     */
    public keyTypeBinder(): PartialKeyBinder {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction<KeyTyped, KeyData>(() => new KeyTyped());
    }

    /**
     * Creates two bindings for undo and redo operations with buttons.
     * @param undo - The undo button
     * @param redo - The redo button
     */
    public undoRedoBinder(undo: Widget<HTMLButtonElement>, redo: Widget<HTMLButtonElement>):
    [Binding<Undo, Interaction<WidgetData<HTMLButtonElement>>, WidgetData<HTMLButtonElement>>,
        Binding<Redo, Interaction<WidgetData<HTMLButtonElement>>, WidgetData<HTMLButtonElement>>] {
        return [
            this.buttonBinder()
                .on(undo)
                .toProduce(() => new Undo(this.undoHistory))
                .bind(),
            this.buttonBinder()
                .on(redo)
                .toProduce(() => new Redo(this.undoHistory))
                .bind()
        ];
    }

    public clear(): void {
        this.observer?.clearObservedBindings();
        this.undoHistory.clear();
    }

    public setBindingObserver(obs?: BindingsObserver): void {
        this.observer?.clearObservedBindings();
        this.observer = obs;
    }
}
