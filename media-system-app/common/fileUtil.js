
const endpoint = 'http://39.97.121.236:9000';

export const getImgUrl =  function(imgName) {
	return endpoint + '/image/' + imgName
}

export function getVideoUrl(videoName) {
	return endpoint + '/video/' + videoName
}