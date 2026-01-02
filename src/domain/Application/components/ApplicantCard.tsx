import styled from "styled-components";
import { FaHeart } from "react-icons/fa";
import type { Applicant } from "../../../types/application.type";
import type { Gender } from "../../auth/auth.types";
import { IoChevronForward } from "react-icons/io5";
interface Props {
  applicants: Applicant[];
  isSharing: boolean;
}

const GENDER_KR: Record<Gender, string> = {
  MALE: "남성",
  FEMALE: "여성",
};

const ApplicantList = ({ applicants, isSharing }: Props) => {
  const filteredApplicants = isSharing
    ? applicants.filter((applicant) => applicant.isVolunteer)
    : applicants;
  return (
    <PostItemWrapper>
      {filteredApplicants.map((applicant) => (
        <Card key={applicant.memberId}>
          <UserRow>
            <UserText>
              <div className="top-row">
                <span className="nickname">{applicant.nickname}</span>
              </div>

              <div className="sub-info">
                {GENDER_KR[applicant.gender]} · {applicant.ageGroup}대
              </div>
            </UserText>

            <GoProfile>
              <IoChevronForward size={16} />
            </GoProfile>
          </UserRow>

          {applicant.isVolunteer && (
            <SharingBadge>
              나눔 <FaHeart size={14} color="#FFA2A2" />
            </SharingBadge>
          )}
        </Card>
      ))}
    </PostItemWrapper>
  );
};

export default ApplicantList;

const PostItemWrapper = styled.div`
  position: relative;
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;

  background-color: ${({ theme }) => theme.color.white};
`;
const UserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserText = styled.div`
  .top-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    .nickname {
      font-size: ${({ theme }) => theme.size.md};
    }
  }

  .sub-info {
    font-size: ${({ theme }) => theme.size.sm};
    color: ${({ theme }) => theme.color.subText3};
  }
`;

const GoProfile = styled.div`
  color: ${({ theme }) => theme.color.subText3};
  display: flex;
  align-items: center;
`;

const SharingBadge = styled.div`
  padding: 4px 10px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.color.red50};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.sm};
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
`;
