import React from "react";
import styled from "styled-components";
import type { Badge } from "../../../types/member.type";
import { DISABILITY_TYPES } from "../../../constants/disabilityTypes";
import { BADGE_RESOURCE_MAP } from "../types/badge.type";

type BadgeCode = "LEVEL_1" | "LEVEL_2" | null;

interface Props {
  badges?: Badge[] | null;
}

const getTitle = (label: string, code: BadgeCode) => {
  if (code === "LEVEL_1") return `${label} 조력자`;
  if (code === "LEVEL_2") return `${label} 전문가`;
  return null;
};

const BadgeChips = ({ badges }: Props) => {
  const items = badges
    ?.map((b) => {
      const disability = DISABILITY_TYPES.find((d) =>
    d.id === b.disabilityCategoryId)

      const title = getTitle(disability.name, b.badgeCode);
      if (!title) return null;

      const resourceSet = BADGE_RESOURCE_MAP[b.disabilityCategoryId];

      const img =
        b.badgeCode === "LEVEL_1"
          ? resourceSet?.LEVEL_1
          : b.badgeCode === "LEVEL_2"
          ? resourceSet?.LEVEL_2
          : resourceSet?.DEFAULT;

      if (!img) return null;

      return {
        key: `${b.disabilityCategoryId}-${b.badgeCode}`,
        title,
        img,
        count: b.count,
      };
    })
    .filter(Boolean) as
    | Array<{ key: string; title: string; img: string; count: number }>
    | undefined;

  if (!items || items.length === 0) return null;

  return (
    <Wrap>
      {items.map((it) => (
        <Chip key={it.key}>
          <Icon src={it.img} alt={it.title} />
          <Text>{it.title}</Text>
        </Chip>
      ))}
    </Wrap>
  );
};

export default BadgeChips;

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* gap: 8px; */
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-right: 8px;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const Text = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
`;
