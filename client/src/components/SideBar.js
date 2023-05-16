import * as React from 'react';
import {useEffect, useState} from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TranslateIcon from '@mui/icons-material/Translate';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';



const CustomizedListItem  = (props) => {
    const [open, setOpen] = useState(false)
    

    const ListItemsArray = [
        'شرح الدرس',
        'أسئلة',
        'محادثة',
        'ترجمة'
    ]


    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={event => setOpen(!open)} onBlur={() => setOpen(false)}>
                    <ListItemText primary={props.lectureName} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
            {ListItemsArray.map((sectionName, index) => {
                return (
                    <div key={index}>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={event => {setOpen(true); props.sendData(props.lectureNameEn, sectionName);}} onBlur={() => setOpen(false)}>
                            <ListItemIcon>
                                {(() => {
                                        if(index === 0) {
                                            return (<CastForEducationIcon />)
                                        } else if(index === 1 ) {
                                            return <QuestionAnswerIcon />
                                        } else if(index ===2) {
                                            return <RecordVoiceOverIcon />
                                        } else {
                                            return <TranslateIcon />
                                        }
                                    }
                                )()}
                            </ListItemIcon>
                            <ListItemText primary={sectionName} />
                        </ListItemButton>
                    </List>
                    <Divider />
                    </div>
                )
            })}
            </Collapse>
            <Divider />

        </>
    )
}

export default function SideBar(props) {

    const [mobileOpen, setMobileOpen] = useState(props.mobileOpenFunc);

    
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };


    useEffect(() => {
        setMobileOpen(true)
    },[props.mobileOpenFunc])

    const lectureObject = {
        'Simple present' : 'المضارع البسيط',
        'Simple past' : 'الماضي البسيط',
        'Descriptive adjectives and adjectives' : 'الصفات والصفات الموصوفة',
        'Comparative form' : 'صيغة المقارنة',
        'plural nouns' : 'الأسماء الجمع',
        'Countable and uncountable nouns' : 'الأسماء المعدودة وغير المعدودة',
        'personal pronouns' : 'الضمائر الشخصية',
        'Adverbs' : 'الظروف',
        'Complex sentences' : 'الجمل المعقدة'
    }


    const drawerWidth = 270;



    const sendData = (sectionName, sectionType ) => {
        props.sendData(sectionName, sectionType )
    }

    
    return (
        <>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    القائمة
                </Typography>
                </Toolbar>
                <Divider />


                {lectureObject && Object.values(lectureObject).map((item, index) => {
                    return (<CustomizedListItem  key={index} lectureName={item} sendData={sendData}  />)
                })}
                     
                
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
                        القائمة
                    </Typography>
                </Toolbar>
                <Divider />

                {lectureObject && Object.values(lectureObject).map((item, index) => {
                    return (<CustomizedListItem  key={index} lectureName={item} lectureNameEn={Object.keys(lectureObject)[index]} sendData={sendData}  />)
                })}
                    
                
            </Drawer>
        </>
    )
}