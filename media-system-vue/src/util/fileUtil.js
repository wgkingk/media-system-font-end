
const endpoint = 'http://39.97.121.236:9000';

export function getImgUrl(imgName) {
	return endpoint + '/image/' + imgName
}

export function getVideoUrl(videoName) {
	return endpoint + '/video/' + videoName
}