import { StyledCard, ImgWrapper, InfoWrapper  } from './styles/Card.styled';
import { Text } from './styles/General.styled';

export default function Card(props) {
    return (
        <StyledCard {...props}>
            <ImgWrapper>
                <img src={ props.imgSrc } alt={ props.imgName } />
            </ImgWrapper>
            <InfoWrapper>
                { props.title && <Text>{ props.title }</Text>}
                
                { props.description && <Text>{ props.description }</Text>}
            </InfoWrapper>
            
        </StyledCard>
    )
}