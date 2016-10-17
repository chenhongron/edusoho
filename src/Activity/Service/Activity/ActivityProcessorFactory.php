<?php

namespace Activity\Service\Activity;

class ActivityProcessorFactory
{
    private static $processorMap = array();

    public static function getActivityProcessor($type)
    {
        if (!in_array($type, self::getActivityTypes())) {
            throw new \InvalidArgumentException('activity type is invalid');
        }

        if (empty(self::$processorMap[$type])) {
            $upperType = ucfirst($type);
            $class     = __NAMESPACE__."\\Processor\\{$upperType}Processor";
            if (class_exists($class)) {
                self::$processorMap[$type] = new $class();
            } else {
                self::$processorMap[$type] = array();
            }
        }

        return self::$processorMap[$type];
    }

    public static function getActivityTypes()
    {
        return array(
            'text' => array(
                'create_modal' => 'ActivityBundle:ActivityManage:text.html.twig'
            )
        );
    }
}