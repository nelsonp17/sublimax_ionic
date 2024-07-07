import { Dialog } from '@capacitor/dialog';
import {supabase} from "@/utils/supabase";

export const dialogShow = async (title: string, message: string)=>{
    // https://capacitorjs.com/docs/apis/dialog
    // confirm, alert, prompt
    await Dialog.alert({
        title,
        message,
    });
}

export const _log = async (name: string, path: string, error: string ) => {
	await supabase.from('logs').insert({ name, path, error });
}