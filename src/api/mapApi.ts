import { instance } from "./axiosInstance";
import type {
  NearByPostReqDto,
  NearByPostResDto,
  NearByHelperResDto,
  NearByHelperReqDto,
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
    params: NearByHelperReqDto
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
