import { ref } from 'vue'
import axios from 'axios'

export async function getDataPage(content_id) {
    const artData = ref(null);
    try {
        const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${content_id}`);
        const { data } = response.data
        artData.value = data
        return artData.value
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}