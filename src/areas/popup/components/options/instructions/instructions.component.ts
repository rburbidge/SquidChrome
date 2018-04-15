import { Component, OnInit } from "@angular/core";

import { Strings } from "../../../../../assets/strings/strings";

type MessageType = 'height';

interface Message {
    type: MessageType;
    data: any;
}

/**
 * Shows instructions content for the app.
 */
@Component({
    selector: 'instructions',
    templateUrl: './instructions.html',
    styleUrls: [ './instructions.css' ]
})
export class InstructionsComponent implements OnInit {
    ngOnInit(): void {
        window.onmessage = (ev: MessageEvent) => {
            const message: Message = ev.data;
            if(message.type == 'height') {
                let iframe = $('iframe')[0] as HTMLIFrameElement;
                iframe.height = message.data;
            }
        };
    }
}