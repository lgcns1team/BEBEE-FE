import { instance } from "./axiosInstance";
import type {
  NearByPostReqDto,
  NearByPostResDto,
  NearByHelperDto,
  NearByHelperResDto,
} from "../types/map.type";

export const mapApi = {
  getNearByPosts: async (
    params: NearByPostReqDto
  ): Promise<NearByPostResDto> => {
    const response = await instance.get<NearByPostResDto>(
      "/match/maps/nearby-posts",
      {
        params,
      }
    );
    return response.data;
  },

  getNearByHelpers: async (
    params: NearByHelperDto
  ): Promise<NearByHelperResDto> => {
    const response = await instance.get<NearByHelperResDto>(
      "/match/maps/nearby-helpers",
      {
        params,
      }
    );
    return response.data;
  },
};
