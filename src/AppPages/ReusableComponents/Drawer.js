
import React from "react";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import List from "@mui/material/List";
import Drawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

// const useStyles = makeStyles({
//   drawer: {
//     width: "190px"
//   }
// });

const DrawerComponent = () => {
  const navigate = useNavigate();
  //const classes = useStyles();
  const itemsList = [
    {
      text: "Home",
      icon: <HomeIcon />,
      onClick: () => navigate("/")
    },
    {
      text: "Add Case",
      icon: <AddIcon />,
      onClick: () => navigate("/Case")
    }
  ];
  return (
    <Drawer variant="permanent" styele={{width:"190px"}}>
      <List>
        {itemsList.map((item, index) => {
          const { text, icon, onClick } = item;
          return (
            <ListItem button key={text} onClick={onClick}>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default DrawerComponent;