import styled from 'styled-components';

export const StyledHeader = styled.header`
    padding: 20px 20px 0;
    display: flex;
    justify-content: space-between;
`;

export const Logo = styled.img`
    max-height: 70px;
`;

export const HeaderLink = styled.a`
    margin-left: 10px;

    img {
        max-width: 50px;
        max-height: 50px;
    }
`;