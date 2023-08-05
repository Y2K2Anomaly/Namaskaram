import { styled } from "@mui/material/styles";
import { Badge } from "@mui/material";


const OfflineBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: 'gray',
        color: 'gray',
        boxShadow: `0 0 0  2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: "none",
            content: '""',
        },
    },
}));

export default OfflineBadge;