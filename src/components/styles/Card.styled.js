import styled, { css } from 'styled-components';

export const StyledCard = styled.div`
    display: flex;
    flex-direction: column;
    margin: ${({margin}) => margin || 0};

    ${(props) => props.size && css`
        width: ${props.size};
    `}
`;

export const ImgWrapper = styled.div`
    font-size: 0;
`;

export const InfoWrapper = styled.div`
    margin-top: 15px;
`;

export const CardTitle = styled.h3`
    font-size: 1.5rem;
    color: #FFF;
    margin: 0;
    padding: 0 10px;
    word-break: break-word;
`;