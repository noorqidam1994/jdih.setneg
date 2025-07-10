import axiosInstance from "../lib/axiosInstance";
import { server } from "../config";

export const galleryService = {
  async fetchImage(fileName, folderId, extension) {
    try {
      const response = await axiosInstance(
        `${server}/api/galeri/cariimg?img=${fileName}&fl=${folderId}&v=${extension}`,
        {
          method: "GET",
          headers: { Accept: "*/*" },
        }
      );
      return await response.blob();
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  },

  createMediaElement(src, extension) {
    if (extension === "photo") {
      const img = document.createElement("img");
      img.src = src;
      img.id = extension;
      return img;
    } else {
      const vid = document.createElement("video");
      vid.src = src;
      vid.id = extension;
      return vid;
    }
  },

  appendMediaToElement(elementId, mediaElement) {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(elementId);
      if (element) {
        element.appendChild(mediaElement);
      }
    }
  },

  async loadAndAppendMedia(fileName, folderId, extension) {
    try {
      const imageBlob = await this.fetchImage(fileName, folderId, extension);
      const objectUrl = URL.createObjectURL(imageBlob);
      const mediaElement = this.createMediaElement(objectUrl, extension);
      this.appendMediaToElement(folderId, mediaElement);
    } catch (error) {
      console.error("Error loading media:", error);
    }
  },

  extractMediaFromElement(elementId) {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(elementId);
      if (!element) return [];

      const imgs = element.getElementsByTagName("img");
      const vids = element.getElementsByTagName("video");
      const allMedia = [];

      Array.from(imgs).forEach((img) =>
        allMedia.push({ url: img.src, type: img.id, altTag: "" })
      );
      Array.from(vids).forEach((vid) =>
        allMedia.push({ url: vid.src, type: vid.id, altTag: "" })
      );

      return allMedia;
    }
    return [];
  }
};