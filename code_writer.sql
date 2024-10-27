-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 27, 2024 at 10:36 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `code_writer`
--

-- --------------------------------------------------------

--
-- Table structure for table `column_meta`
--

DROP TABLE IF EXISTS `column_meta`;
CREATE TABLE IF NOT EXISTS `column_meta` (
  `column_id` int NOT NULL AUTO_INCREMENT,
  `table_id` int NOT NULL,
  `database_id` int NOT NULL,
  `column_name` varchar(50) NOT NULL,
  `column_default` varchar(100) DEFAULT NULL,
  `is_nullable` varchar(10) DEFAULT NULL,
  `data_type` varchar(15) DEFAULT NULL,
  `character_maximum_length` varchar(10) DEFAULT NULL,
  `numeric_precision` varchar(10) DEFAULT NULL,
  `numeric_scale` varchar(10) DEFAULT NULL,
  `column_type` varchar(15) DEFAULT NULL,
  `column_key` varchar(15) DEFAULT NULL,
  `extra` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`column_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `column_property`
--

DROP TABLE IF EXISTS `column_property`;
CREATE TABLE IF NOT EXISTS `column_property` (
  `column_property_id` int NOT NULL AUTO_INCREMENT,
  `column_id` int NOT NULL,
  `property_name` varchar(15) NOT NULL,
  `property_description` varchar(300) DEFAULT NULL,
  `property_value` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`column_property_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `database_meta`
--

DROP TABLE IF EXISTS `database_meta`;
CREATE TABLE IF NOT EXISTS `database_meta` (
  `database_id` int NOT NULL AUTO_INCREMENT,
  `database_name` varchar(50) NOT NULL,
  `database_unique_label` varchar(50) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`database_id`),
  UNIQUE KEY `database_unique_label` (`database_unique_label`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `database_property`
--

DROP TABLE IF EXISTS `database_property`;
CREATE TABLE IF NOT EXISTS `database_property` (
  `database_property_id` int NOT NULL AUTO_INCREMENT,
  `database_id` int NOT NULL,
  `property_name` varchar(15) NOT NULL,
  `property_description` varchar(300) NOT NULL,
  `property_value` varchar(10) NOT NULL,
  PRIMARY KEY (`database_property_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `relation_meta`
--

DROP TABLE IF EXISTS `relation_meta`;
CREATE TABLE IF NOT EXISTS `relation_meta` (
  `relation_meta_id` int NOT NULL AUTO_INCREMENT,
  `column_one_id` int NOT NULL,
  `column_two_id` int NOT NULL,
  `relation_type_id` int DEFAULT NULL,
  PRIMARY KEY (`relation_meta_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `relation_property`
--

DROP TABLE IF EXISTS `relation_property`;
CREATE TABLE IF NOT EXISTS `relation_property` (
  `relation_property_id` int NOT NULL AUTO_INCREMENT,
  `relation_id` int NOT NULL,
  `property_name` varchar(15) NOT NULL,
  `property_description` varchar(300) DEFAULT NULL,
  `property_value` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`relation_property_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `table_meta`
--

DROP TABLE IF EXISTS `table_meta`;
CREATE TABLE IF NOT EXISTS `table_meta` (
  `table_id` int NOT NULL AUTO_INCREMENT,
  `database_id` int NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `table_description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`table_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `table_property`
--

DROP TABLE IF EXISTS `table_property`;
CREATE TABLE IF NOT EXISTS `table_property` (
  `table_property_id` int NOT NULL AUTO_INCREMENT,
  `table_id` int NOT NULL,
  `property_name` varchar(15) NOT NULL,
  `property_description` varchar(300) DEFAULT NULL,
  `property_value` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`table_property_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
