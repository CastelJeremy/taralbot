import ytdl from 'ytdl-core';
import ytsr from 'ytsr';

/*
 * Returns a video url with the given searchString.
 */
async function searchVideoUrl(searchString: string) {
    // Get search url for a video type with the searchString
    const filters = await ytsr.getFilters(searchString);
    const filter = filters.get('Type')?.get('Video');

    if (!filter || !filter.name || filter.name != 'Video' || !filter.url) {
        throw new Error('Cannot apply filters to the specified string');
    }

    // Search for first video with the filter.url
    const search = await ytsr(filter.url, { limit: 1, gl: 'FR' });

    if (
        !search ||
        !search.items ||
        !search.items[0] ||
        search.items[0].type != 'video'
    ) {
        throw new Error('No result for the specified string');
    }

    // Check the video length is lower than 1 hour
    if (search.items[0].duration == null) {
        throw new Error('Could not determine video length');
    }

    const durations = search.items[0].duration.split(':');

    if (durations.length > 3 || (durations.length == 3 && durations[0] > '1')) {
        throw new Error('Found video is longer than 1 hour');
    }

    return search.items[0].url;
}

/**
 * Returns a readable audio stream from a video url.
 */
function getAudioStream(videoUrl: string) {
    const audio = ytdl(videoUrl, {
        filter: (format) => {
            return (
                (format.container == 'webm' || format.container == 'mp4') &&
                format.hasVideo == false
            );
        },
    });

    return audio;
}

export default { searchVideoUrl, getAudioStream };
