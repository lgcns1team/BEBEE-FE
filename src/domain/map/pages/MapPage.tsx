import React from "react";
import MapDisabledPage from "./MapDisabledPage";
import MapHelperPage from "./MapHelperPage";
import { useUserStore } from "../../../store/useUserStore";

const MAP_PAGE_BY_ROLE = {
  DISABLED : MapDisabledPage,
  HELPER : MapHelperPage
} as const


const MapPage = () => {
  
  const {user} = useUserStore();

  const RoleMapPage = user.role ? MAP_PAGE_BY_ROLE[user.role] : null;
  
  
  return <div>
    <RoleMapPage/>
  </div>;
};

export default MapPage;
