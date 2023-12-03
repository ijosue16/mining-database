import { MdOutlineRedo,MdOutlineUndo,MdFormatBold,MdFormatItalic,MdFormatUnderlined,MdFormatStrikethrough,MdInsertLink,MdFormatAlignJustify,MdFormatAlignLeft,MdFormatAlignRight, MdFormatQuote, MdFormatListBulleted, MdFormatListNumbered,MdCode,MdImage  } from "react-icons/md";
import { LuHeading1,LuHeading2,LuHeading3 } from "react-icons/lu";
import { RiText } from "react-icons/ri";
// import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
// import FormatHeader1 from "mdi-material-ui/FormatHeader1";
// import FormatHeader2 from "mdi-material-ui/FormatHeader2";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
// import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
// import FormatText from "mdi-material-ui/FormatText";
// import CodeIcon from "@mui/icons-material/Code";
// import ImageIcon from "@mui/icons-material/Image";

export const eventTypes = {
  paragraph: "paragraph",
  h1: "h1",
  h2: "h2",
  ul: "ul",
  ol: "ol",
  quote: "quote",
  formatCode: "formatCode",
  formatUndo: "formatUndo",
  formatRedo: "formatRedo",
  formatBold: "formatBold",
  formatItalic: "formatItalic",
  formatUnderline: "formatUnderline",
  formatStrike: "formatStrike",
  formatInsertLink: "formatInsertLink",
  formatAlignLeft: "formatAlignLeft",
  formatAlignCenter: "formatAlignCenter",
  formatAlignRight: "formatAlignRight",
  insertImage: "insertImage",
};

const pluginsList = [
  {
    id: 1,
    Icon: <RiText/>,
    event: eventTypes.paragraph,
  },
  {
    id: 2,
    Icon: <LuHeading1/>,
    event: eventTypes.h1,
  },
  {
    id: 3,
    Icon: <LuHeading2/>,
    event: eventTypes.h2,
  },
  {
    id: 4,
    Icon:<MdFormatListBulleted/>,
    event: eventTypes.ul,
  },

  {
    id: 5,
    Icon: <MdFormatListNumbered/>,
    event: eventTypes.ol,
  },
  {
    id: 6,
    Icon: <MdFormatQuote/>,
    event: eventTypes.quote,
  },

  {
    id: 7,
    Icon: <MdCode/>,
    event: eventTypes.formatCode,
  },
  {
    id: 8,
    Icon: <MdOutlineUndo />,
    event: eventTypes.formatUndo,
  },
  {
    id: 9,
    Icon: <MdOutlineRedo />,
    event: eventTypes.formatRedo,
  },
  {
    id: 10,
    Icon: <MdFormatBold />,
    event: eventTypes.formatBold,
  },
  {
    id: 11,
    Icon: <MdFormatItalic />,
    event: eventTypes.formatItalic,
  },
  {
    id: 12,
    Icon: <MdFormatUnderlined />,
    event: eventTypes.formatUnderline,
  },
  // { // reactive it if you need it
  //   id: 13,
  //   Icon: <MdFormatStrikethrough />,
  //   event: eventTypes.formatStrike,
  // },
  {
    id: 13,
    Icon: <MdImage/>,
    event: eventTypes.insertImage,
  },
  {
    id: 14,
    Icon: <MdInsertLink />,
    event: eventTypes.formatInsertLink,
  },
  {
    id: 15,
    Icon: <MdFormatAlignLeft />,
    event: eventTypes.formatAlignLeft,
  },

  {
    id: 16,
    Icon: <MdFormatAlignJustify />,
    event: eventTypes.formatAlignCenter,
  },
  {
    id: 17,
    Icon: <MdFormatAlignRight />,
    event: eventTypes.formatAlignRight,
  },
];

export default pluginsList;