import { TbBeach, TbMountain, TbPool } from "react-icons/tb";

import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import {
  FaSkiing,
  FaPumpSoap,
  FaShower,
  FaFireExtinguisher,
  FaUmbrellaBeach,
  FaKey,
} from "react-icons/fa";
import { FaHouseUser, FaPeopleRoof, FaKitchenSet } from "react-icons/fa6";
import {
  BiSolidWasher,
  BiSolidDryer,
  BiSolidFirstAid,
  BiWifi,
  BiSolidFridge,
  BiWorld,
} from "react-icons/bi";
import { BsSnow, BsFillDoorOpenFill, BsPersonWorkspace } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import {
  MdOutlineVilla,
  MdMicrowave,
  MdBalcony,
  MdYard,
  MdPets,
} from "react-icons/md";
import {
  PiBathtubFill,
  PiCoatHangerFill,
  PiTelevisionFill,
} from "react-icons/pi";
import { TbIroning3 } from "react-icons/tb";
import {
  GiHeatHaze,
  GiCctvCamera,
  GiBarbecue,
  GiToaster,
  GiCampfire,
} from "react-icons/gi";
import { AiFillCar } from "react-icons/ai";

/*labs */
import { MdOutlineSchool, MdRecordVoiceOver } from "react-icons/md";
import {
  FaLaptopCode,
  FaBook,
  FaMusic,
  FaTheaterMasks,
  FaPencilRuler,
  FaMicroscope,
  FaBriefcase,
} from "react-icons/fa";
import {
  GiChemicalDrop,
  GiPaintBrush,
  GiGearHammer,
  GiCircuitry,
  GiRobotGolem,
  GiVrHeadset,
} from "react-icons/gi";
/*labs */

export const categories = [
  {
    label: "All",
    icon: <BiWorld />,
  },
  {
    img: "assets/lecture_hall.jpg",
    label: "Lecture Halls",
    icon: <MdOutlineSchool />,
    description: "Large rooms designed for lectures and presentations.",
  },
  {
    img: "assets/computer_lab.jpg",
    label: "Computer Labs",
    icon: <FaLaptopCode />,
    description: "Rooms equipped with computers and IT resources.",
  },
  {
    img: "assets/science_lab.jpg",
    label: "Science Labs",
    icon: <GiChemicalDrop />,
    description: "Spaces for conducting scientific experiments.",
  },
  {
    img: "assets/art_studio.jpg",
    label: "Art Studios",
    icon: <GiPaintBrush />,
    description: "Creative spaces for art and design projects.",
  },
  {
    img: "assets/library.jpg",
    label: "Libraries",
    icon: <FaBook />,
    description: "Quiet spaces with books and study resources.",
  },
  {
    img: "assets/music_room.jpg",
    label: "Music Rooms",
    icon: <FaMusic />,
    description: "Rooms for music practice and lessons.",
  },
  {
    img: "assets/language_lab.jpg",
    label: "Language Labs",
    icon: <MdRecordVoiceOver />,
    description: "Spaces for language learning and practice.",
  },
  {
    img: "assets/workshop.jpg",
    label: "Workshops",
    icon: <GiGearHammer />,
    description: "Hands-on spaces for technical and mechanical projects.",
  },
  {
    img: "assets/engineering_lab.jpg",
    label: "Engineering Labs",
    icon: <GiCircuitry />,
    description: "Specialized labs for engineering experiments.",
  },
  {
    img: "assets/theater_room.jpg",
    label: "Theater Rooms",
    icon: <FaTheaterMasks />,
    description: "Spaces for performing arts and drama activities.",
  },
  {
    img: "assets/robotics_lab.jpg",
    label: "Robotics Labs",
    icon: <GiRobotGolem />,
    description: "Labs for designing and programming robots.",
  },
  {
    img: "assets/design_lab.jpg",
    label: "Design Labs",
    icon: <FaPencilRuler />,
    description: "Creative spaces for architecture and industrial design.",
  },
  {
    img: "assets/medical_lab.jpg",
    label: "Medical Labs",
    icon: <FaMicroscope />,
    description: "Labs for medical research and diagnostics.",
  },
  {
    img: "assets/virtual_lab.jpg",
    label: "Virtual Labs",
    icon: <GiVrHeadset />,
    description: "Spaces for immersive learning using virtual reality.",
  },
  {
    img: "assets/business_room.jpg",
    label: "Business Rooms",
    icon: <FaBriefcase />,
    description: "Rooms for business studies and presentations.",
  },
];

export const facilities = [
  {
    name: "Personal care products",
    icon: <FaPumpSoap />,
  },
  {
    name: "Outdoor shower",
    icon: <FaShower />,
  },
  {
    name: "Washer",
    icon: <BiSolidWasher />,
  },
  {
    name: "Dryer",
    icon: <BiSolidDryer />,
  },
  {
    name: "Hangers",
    icon: <PiCoatHangerFill />,
  },
  {
    name: "Iron",
    icon: <TbIroning3 />,
  },
  {
    name: "TV",
    icon: <PiTelevisionFill />,
  },
  {
    name: "Dedicated workspace",
    icon: <BsPersonWorkspace />,
  },
  {
    name: "Air Conditioning",
    icon: <BsSnow />,
  },

  {
    name: "Security cameras",
    icon: <GiCctvCamera />,
  },
  {
    name: "Fire extinguisher",
    icon: <FaFireExtinguisher />,
  },
  {
    name: "First Aid",
    icon: <BiSolidFirstAid />,
  },
  {
    name: "Wifi",
    icon: <BiWifi />,
  },
  {
    name: "Cooking set",
    icon: <FaKitchenSet />,
  },
  {
    name: "Refrigerator",
    icon: <BiSolidFridge />,
  },
  {
    name: "Microwave",
    icon: <MdMicrowave />,
  },

  {
    name: "Free parking",
    icon: <AiFillCar />,
  },
  {
    name: "Self check-in",
    icon: <FaKey />,
  },
  {
    name: " Pet allowed",
    icon: <MdPets />,
  },
];
