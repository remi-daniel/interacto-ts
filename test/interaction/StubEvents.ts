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

export function createMouseEvent(type: string, target: EventTarget, screenX?: number, screenY?: number, clientX?: number,
                                 clientY?: number, button?: number): MouseEvent {

    const screenXvalue = screenX ?? 0;
    const screenYvalue = screenY ?? 0;
    const clientXvalue = clientX ?? 0;
    const clientYvalue = clientY ?? 0;
    const buttonValue = button ?? 0;
    return new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: false,
        detail: 1,
        screenX: screenXvalue,
        screenY: screenYvalue,
        clientX: clientXvalue,
        clientY: clientYvalue,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: buttonValue,
        relatedTarget: target
    });
}

export function createKeyEvent(type: string, keyCode: string): KeyboardEvent {
    return new KeyboardEvent(type, {
        cancelable: false,
        bubbles: true,
        view: window,
        code: keyCode,
        repeat: false
    });
}

export function createUIEvent(type: string): UIEvent {
    return new UIEvent(type, {
        detail : 0,
        bubbles: true,
        cancelable: false,
        view: window
    });
}
