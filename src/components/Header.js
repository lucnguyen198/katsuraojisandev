import { StyledHeader, Logo, HeaderLink } from "./styles/Header.styled";
import { FlexWrapper } from "./styles/General.styled";

export default function Header() {
  return (
    <StyledHeader>
      <Logo src="./assets/images/MainUI/logo.png" alt="" />
      <FlexWrapper align="start" justify="space-between">
        <HeaderLink
          href="https://opensea.io/collection/katsura-ojisan"
          target="_blank"
        >
          <img
            src="./assets/images/MainUI/btn_opensea.png"
            alt="OpenSea.io"
          />
        </HeaderLink>
        <HeaderLink href="https://twitter.com/katsura_ojisan" target="_blank">
          <img src="./assets/images/MainUI/btn_twitter.png" alt="Twitter" />
        </HeaderLink>
      </FlexWrapper>
    </StyledHeader>
  );
}
