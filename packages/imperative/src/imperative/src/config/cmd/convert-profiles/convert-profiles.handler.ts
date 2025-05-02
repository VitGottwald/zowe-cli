/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { ICommandHandler, IHandlerParameters, IHandlerResponseConsoleApi } from "../../../../../cmd";
import {
    ConvertMsg, ConvertMsgFmt, IConvertV1ProfOpts, IConvertV1ProfResult
} from "../../../../../config";
import { uninstall as uninstallPlugin } from "../../../plugins/utilities/npm-interface";
import { TextUtils } from "../../../../../utilities";
/**
 * Handler for the convert profiles command.
 */
export default class ConvertProfilesHandler implements ICommandHandler {
    /**
     * Process the command input and display output.
     *
     * @param {IHandlerParameters} params Parameters supplied by yargs
     *
     * @throws {ImperativeError}
     */
    public async process(params: IHandlerParameters): Promise<void> {
        throw "Conversion of profiles no longer supporterd";
    }

    /**
     * Show all of the messages of a given type.
     * The intent is to allow our caller to show a report of all actions,
     * followed by a report of all errors.
     *
     * @param setOfMsgs The available set of messages to display.
     * @param msgTypeToShow The type of message to display.
     *                      Either ConvertMsgFmt.REPORT_LINE or ConvertMsgFmt.ERROR_LINE.
     * @param consoleApiFun The IHandlerResponseConsoleApi object used to display
     *                      messages in a CLI terminal.
     */
    private showMsgsByType(
        setOfMsgs: ConvertMsg[],
        msgTypeToShow: number,
        consoleApiFun: IHandlerResponseConsoleApi
    ): void {

        let firstMsgLine: boolean = true;
        for (const nextMsg of setOfMsgs) {
            let startingMsgText = "";
            if (nextMsg.msgFormat & msgTypeToShow) {
                if (firstMsgLine) {
                    firstMsgLine = false;
                    if (msgTypeToShow & ConvertMsgFmt.ERROR_LINE) {
                        startingMsgText = "\nThe following operation(s) were not completed:\n";
                    }

                    // We want one newline before our first message, but avoid a double newline
                    if (!(nextMsg.msgFormat & ConvertMsgFmt.PARAGRAPH)) {
                        startingMsgText += "\n";
                    }
                }

                if (nextMsg.msgFormat & ConvertMsgFmt.PARAGRAPH) {
                    startingMsgText += "\n";
                }
                if (nextMsg.msgFormat & ConvertMsgFmt.INDENT) {
                    startingMsgText += "    ";
                }

                if (msgTypeToShow & ConvertMsgFmt.REPORT_LINE) {
                    consoleApiFun.log(startingMsgText + nextMsg.msgText);
                } else {
                    consoleApiFun.error(TextUtils.chalk.red(startingMsgText + nextMsg.msgText));
                }
            }
        }
    }
}
