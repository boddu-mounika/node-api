import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function Breadcrumb(props) {
    const navigate = useNavigate();
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/" onClick={() => navigate("/")}>
          Home
        </Link>
        {/* <Link
          underline="hover"
          color="text.primary"
          href="/material-ui/react-breadcrumbs/"
          aria-current="page"
        >
          {props.caseNumber}
        </Link> */}
        <Typography color="text.primary">{props.caseNumber}</Typography>
      </Breadcrumbs>
    </div>
  );
}