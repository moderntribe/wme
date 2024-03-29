
export interface FtcFormValueInterface<T> {
	value: T;
	touched: boolean;
	isValid?: boolean;
}

export interface FtcFormItemsInterface {
	username: FtcFormValueInterface<string>;
	password: FtcFormValueInterface<string>;
	logoId: FtcFormValueInterface<string>;
	siteName: FtcFormValueInterface<string>;
	ownerIdentity: FtcFormValueInterface<string>
	ownerName: FtcFormValueInterface<string>
	businessLocation: FtcFormValueInterface<string>
	industry: FtcFormValueInterface<string>;
	siteDescription: FtcFormValueInterface<string>;
	goals: FtcFormValueInterface<string[]>;
	siteKeywords: FtcFormValueInterface<string[]>;
	sitePersonality: FtcFormValueInterface<string>;
	imageCollection: FtcFormValueInterface<string>;

	fontPairing: FtcFormValueInterface<string>;
	template: FtcFormValueInterface<string>;
	colorPalette: FtcFormValueInterface<string>;
}

function addDefaults<T>(defaultValue: T): FtcFormValueInterface<T> {
	return {
		value: defaultValue,
		touched: false,
		isValid: false
	};
}

export default {
	username: addDefaults(''),
	password: addDefaults(''),
	logoId: addDefaults(''),
	siteName: addDefaults(''),
	tagline: addDefaults(''),
	industry: addDefaults(''),
	subIndustry: addDefaults(''),
	siteDescription: addDefaults(''),
	sitePersonality: addDefaults(''),
	siteKeywords: addDefaults([]),
	goals: addDefaults([]),
	template: addDefaults(''),
	colorPalette: addDefaults(''),
	fontPairing: addDefaults(''),
	ownerIdentity: addDefaults(''),
	ownerName: addDefaults(''),
	businessLocation: addDefaults(''),
	imageCollection: addDefaults('')
} as FtcFormItemsInterface;
