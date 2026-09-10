<?php

use chums\ui\WebUI2;
use chums\user\Groups;

require_once("autoload.inc.php");
$ui = new WebUI2([
    'requiredRoles' => [Groups::PRODUCT_ADMIN, Groups::PRODUCTION],
    'title' => 'SKU System Editor',
    'bodyClassName' => 'container-fluid',
    'contentFile' => 'body.inc.php'
]);
$ui->addViteManifest()
    ->render();
