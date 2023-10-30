<?php

class SpacesView implements ViewInterface
{
    public function render() {
        require_once __DIR__ . '/../../components/user/Spaces.php';
    }
}