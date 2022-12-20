import Card from "./Card";

import { StyledListCard } from "./styles/ListCard.styled";
import { Container, FlexWrapper } from "./styles/General.styled";

export default function ListCard() {
  return (
    <StyledListCard>
      <Container padding="0">
        <FlexWrapper flexWrap="wrap" justify="center">
          <Card
            imgSrc="./assets/images/MainUI/about_1.gif"
            title="Generative NFT"
            description="1,111 characters"
            size="270px"
            margin="20px 60px"
          />
          <Card
            imgSrc="./assets/images/MainUI/about_2.gif"
            title="Whitelist only"
            description="Chain: Polygon"
            size="270px"
            margin="20px 60px"
          />
          <Card
            imgSrc="./assets/images/MainUI/about_3.gif"
            title="Price: Free"
            description="cc0"
            size="270px"
            margin="20px 60px"
          />
        </FlexWrapper>
      </Container>
    </StyledListCard>
  );
}
