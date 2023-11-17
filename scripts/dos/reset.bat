@echo off
setlocal

REM Delete .env file
if exist ".env" (
    del ".env"
    echo PHPAPP .env deleted successfully.
) else (
    echo PHPAPP .env does not exist.
)

REM Delete mysql folder
set "folderName=mysql"

REM Combine the current path and the mysql folder
set "folderPath=%cd%\%folderName%"

REM Check if the folder exists before attempting to delete it
if exist "%folderPath%" (
    rmdir /s /q "%folderPath%"
    echo PHPAPP mysql folder deleted successfully.
) else (
    echo PHPAPP mysql folder does not exist.
)

endlocal

REM Delete the Docker image with the tag "moments:latest"
docker rmi moments:latest

echo.