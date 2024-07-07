# Ejecuta el siguiente comando para limpiar la caché de Gradle
gradlew clean

# Ejecutar server
ionic server

# sincronizar
npx cap sync

# Ion copy android prod
ionic cap copy android --prod

# ionic build
ionic build

# cap build
npx cap build

# Open Android Studio
npx cap open android

# Run 
npx cap run android
npx cap run android --prod
ionic cap run android -l --external
ionic cap run android --prod -l --external

ionic platform remove android
ionc resource 

# ngrok
## Utilice un proxy inverso como ngrok o serveo para hacer que su servidor local esté temporalmente disponible públicamente con HTTPS.
ngrok http [http://localhost:8100](http://localhost:8100) 

# qr lector
[https://www.npmjs.com/package/vue-qrcode-reader](https://www.npmjs.com/package/vue-qrcode-reader)
[https://gruhn.github.io/vue-qrcode-reader/api/QrcodeStream.html](https://gruhn.github.io/vue-qrcode-reader/api/QrcodeStream.html)
[https://gruhn.github.io/vue-qrcode-reader/demos/FullDemo.html](https://gruhn.github.io/vue-qrcode-reader/demos/FullDemo.html)


# Configuracion capacitor
[https://capacitorjs.com/docs/config](https://capacitorjs.com/docs/config)

# Version Android
\android\app\build.gradle

En Android Studio
Archivo > Estructura del proyecto > Módulos > Configuración predeterminada

Config.xml eliminado en Cordova, consulte [https://capacitorjs.com/docs/cordova#native-project-management](https://capacitorjs.com/docs/cordova#native-project-management)


# Archivo de configuración Capacitor "capacitor.config.ts" para producción
Un archivo de configuración Capacitor "capacitor.config.ts" para producción debe incluir lo siguiente:

## Información de la aplicación:

* appId: El ID de la aplicación de tu proyecto Capacitor.
* appName: El nombre de tu aplicación.
* version: La versión de tu aplicación.
* icon: La ruta a la imagen del icono de tu aplicación.

## Plataformas:

* web: Especifica la configuración para la plataforma web.
* android: Especifica la configuración para la plataforma Android.
* ios: Especifica la configuración para la plataforma iOS.


## Construir:

* browser: Especifica la configuración para la compilación del navegador web.
* android: Especifica la configuración para la compilación de Android.
* ios: Especifica la configuración para la compilación de iOS.


## Servicios:

* plugins: Especifica la configuración de los plugins que estás utilizando.

## Ejemplo de archivo de configuración "capacitor.config.ts" para producción:

export default {
  appId: 'com.example.app',
  appName: 'My Capacitor App',
  version: '1.0.0',
  icon: './assets/icon.png',
  web: {
    browserCrossOriginAllowed: true,
  },
  android: {
    gradleVersion: '7.0.2',
    androidSdkVersion: '33',
    minSdkVersion: 21,
    targetSdkVersion: 33,
    buildToolsVersion: '33.0.0',
    signingKeyId: 'YOUR_KEY_ID',
    signingKeyPath: 'path/to/your/key.pem',
    signingKeyPassword: 'YOUR_KEY_PASSWORD',
  },
  ios: {
    codeSigningId: 'YOUR_CODE_SIGNING_ID',
    provisioningProfile: 'path/to/your/provisioning.mobileprovision',
    teamId: 'YOUR_TEAM_ID',
  },
  plugins: {
    PushNotifications: {
      ios: {
        pkCertificate: './ios/certificates/push.pem',
      },
    },
  },
};

# Generación de pantalla de presentación e icono de aplicación
assets/
├── icon.png
└── splash.png

Asegúrese de utilizar las dimensiones correctas para esos archivos:

• Los recursos/iconos (png|jpg) deben tener al menos 1024×1024px
• assets/splash.(png|jpg) debe tener al menos 2732×2732px

Ahora podemos instalar el complemento Capacitor assets y ejecutar el comando generate en nuestro proyecto:
npm install @capacitor/assets
npx capacitor-assets generate

Mas información [text](https://ionic.io/blog/building-and-releasing-your-capacitor-android-app)


# Despliegue de la app
[https://ionic.io/appflow](https://ionic.io/appflow)
explore mas contenido con este sdk [https://ionic.io/docs/appflow/deploy/setup/capacitor-sdk](https://ionic.io/docs/appflow/deploy/setup/capacitor-sdk)


# Permissions

<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />