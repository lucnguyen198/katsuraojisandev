import styled, { css } from 'styled-components';

export const LayoutWrapper = styled.div`
    position: relative;
    padding-bottom: 100px;
    min-height: 100vh;
`;

export const Container = styled.div`
    width: 100%;
    max-width: 1400px;
    padding: ${({padding}) => padding || '0 20px'};
    margin: 0 auto;
`
export const FlexWrapper = styled.div`
    display: flex;
    align-items: ${({align}) => align || 'start'};
    justify-content: ${({justify}) => justify || 'start'};
    height: ${({height}) => height || 'auto'};
    flex-wrap: ${({flexWrap}) => flexWrap || 'no-wrap'};
`;

export const BlockCenter = styled.div`
    text-align: center;
    min-height: ${({minHeight}) => minHeight || 0};
`;

export const Button = styled.button`
    height: 60px;
    min-width: 200px;
    text-align: center;
    border-radius: 30px;
    padding: 0 50px;
    border: 0;
    outline: 0 none;
    font-size: 1.25rem;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    margin: ${({margin}) => margin || 0};
    
    ${(props) => props.disabled === true ? css`
        background-color: #42a9a8;
        color: #b1d7d6;
    ` : css`
        color: #FFF;
        background-color: #5c5b8d;
    `}

    &:focus {
        opacity: .9;
    }
`;

export const ButtonCircle = styled(Button)`
    height: 40px;
    width: 40px;
    min-width: 0;
    font-size: 1.875rem;
    border-radius: 100%;
    padding: 0;
    text-align: center;
`;

export const Text = styled.p`
    font-size: 1.25rem;
    color: #FFF;
    text-transform: uppercase;
    margin: ${({margin}) => margin || 0};
    font-weight: normal;
`;

export const Title = styled.h2`
    font-size: 1.875rem;
    color: #FFF;
    text-transform: uppercase;
    font-weight: bold;
    margin: ${({margin}) => margin || 0};
    padding: 0;
`;

export const LargeTitle = styled(Title)`
    font-size: 2rem;

    color: ${({color}) => color || '#FFF'};
`;

export const InputValue = styled.div`
    height: 60px;
    border-radius: 8px;
    background-color: #FFF;
    text-align: center;
    min-width: 60px;
    padding: 0 20px;
    line-height: 60px;
    color: #5c5b8d;
    font-size: 1.875rem;
    margin: 0 20px;
`