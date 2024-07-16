import {ToggleCustomEvent} from "@ionic/vue";
import {ref} from "vue";

export default class modeDark{
    useDark () {
        const paletteToggle = ref(false);
        // Use matchMedia to check the user preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        // Add or remove the "ion-palette-dark" class on the html element
        const toggleDarkPalette = (shouldAdd: boolean) => {
            document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
            //saveToStorage('toggle_mode_dark', shouldAdd)
        };

        // Check/uncheck the toggle and update the palette based on isDark
        const initializeDarkPalette = (isDark: boolean) => {
            //console.log(isDark)
            //const toggleModeDark = <boolean>readFromStorage('toggle_mode_dark')
            const toggleModeDark = isDark
            if(toggleModeDark){
                try{
                    toggleDarkPalette(toggleModeDark);
                    paletteToggle.value = toggleModeDark;
                }catch(e){
                    //console.log(e)
                    //saveToStorage('toggle_mode_dark', isDark)
                    paletteToggle.value = isDark;
                    toggleDarkPalette(isDark);
                }
            }else{
                paletteToggle.value = isDark;
                toggleDarkPalette(isDark);
            }

        };

        // Initialize the dark palette based on the initial
        // value of the prefers-color-scheme media query
        initializeDarkPalette(prefersDark.matches);

        // Listen for changes to the prefers-color-scheme media query
        prefersDark.addEventListener('change', (mediaQuery) => initializeDarkPalette(mediaQuery.matches));

        // Listen for the toggle check/uncheck to toggle the dark palette
        const toggleChange = (ev: ToggleCustomEvent) => {
            toggleDarkPalette(ev.detail.checked);
        };

        return {
            paletteToggle,
            toggleChange,
        }
    }
}