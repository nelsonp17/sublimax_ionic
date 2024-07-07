import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { _log } from './testing'

export const checkCameraPermissions = async () => {
	let result = false
	await Camera.checkPermissions()
	.then(()=>{
		result = true;
	})
	.catch(()=>{
		result = false
	})
	return result
}

export const askForCameraPermission = async (): Promise<boolean> => {
	const hasPermission = await Camera.checkPermissions();

	if (hasPermission.camera === 'granted') {
		// Permission already granted, proceed with camera access
		return true;
	}

	const status = await Camera.requestPermissions({
		camera: true,
	});

	if (status.camera === 'granted') {
		// Permission granted after request
		return true;
	} else {
		// Permission denied
		return false;
	}
}


export const takePicture = async () => {
	const image = await Camera.getPhoto({
		quality: 90,
		allowEditing: true,
		resultType: CameraResultType.Uri
	});

	// image.webPath will contain a path that can be set as an image src.
	// You can access the original file using image.path, which can be
	// passed to the Filesystem API to read the raw data of the image,
	// if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
	var imageUrl = image.webPath;

	// Can be set to the src of an image now
	imageElement.src = imageUrl;
};
export const checkStoragePermissions = async () => {
	let result = false
	await Filesystem.checkPermissions()
	.then(()=>{
		result = true;
	})
	.catch(()=>{
		result = false
	})
	return result
}

export const requestCameraPermissions = async () => {
	await Camera.requestPermissions({
		permissions: ['camera', 'photos']
	})
	.then(() => {
		_log('Permiso concedido', 'requestCameraPermissions -> then -> permission', 'Camera permissions granted')
	})
	.catch(error => {
		_log('Permiso denegado', 'requestCameraPermissions -> catch -> permission', `Failed to request camera permissions: ${error}`)

		// Handle permission denied scenario
	});
}

export const requestStoragePermissions = async () => {
	try{
		await Filesystem.requestPermissions()
		.then(() => {
			console.log('Storage permissions granted');
			_log('Permiso concedido', 'requestStoragePermissions -> then -> permission', 'Storage permissions granted')
		})
		.catch(error => {
			_log('Permiso denegado', 'requestStoragePermissions -> catch -> permission', `Failed to request storage permissions: ${error}`)
			// Handle permission denied scenario
		});
	}catch(e){
		_log('Error al intentar solicitar permiso', 'try/catch requestStoragePermissions -> catch -> permission', `${e}`)
	}
}