<?php

namespace Tribe\WME\Sitebuilder\Services;

class Goals
{
	const GOALS_BUSINESS      = 'business';
	const GOALS_ECOMMERCE     = 'eCommerce';
	const GOALS_BLOG          = 'blog';
	const GOALS_CAREERS       = 'careers';
	const GOALS_SERVICES      = 'services';
	const GOALS_PRICING_PLANS = 'pricingPlans';

	/**
	 * Get the goal choices.
	 *
	 * @return array
	 */
	public function getChoices() {
		$goals = [
			[
				'key'         => self::GOALS_BUSINESS,
				'value'       => __( 'Create a home for myself, my business or organization online', 'wme-sitebuilder' ),
				'description' => __( 'A web presence that shares information about my services, and expertise and helps customers find and get in contact with me.', 'wme-sitebuilder' ),
				'icon'        => 'WebAsset',
				'requiredPages' => [
					'home' => [
						'title' => __( 'Home', 'wme-sitebuilder' ),
					],
					'about' => [
						'title' => __( 'About', 'wme-sitebuilder' ),
					],
					'contact' => [
						'title' => __( 'Contact', 'wme-sitebuilder' ),
					],
				],
				'requiredPlugins' => [],
			],
			[
				'key'         => self::GOALS_ECOMMERCE,
				'value'       => __( 'Sell physical or digital goods online', 'wme-sitebuilder' ),
				'description' => __( 'An ecommerce store to accept payment and manage customers.', 'wme-sitebuilder' ),
				'icon'        => 'ShoppingCart',
				'requiredPages' => [
					'shop' => [
						'title' => __( 'Shop', 'wme-sitebuilder' ),
					]
				],
				'requiredPlugins' => [
					'woocommerce',
				],
			],
			[
				'key'         => self::GOALS_BLOG,
				'value'       => __( 'Share news or write blogs', 'wme-sitebuilder' ),
				'description' => __( 'Posting content is the primary goal of my organization or a core component of my website.', 'wme-sitebuilder' ),
				'icon'        => 'Article',
				'requiredPages' => [
					'blog' => [
						'title' => __( 'News', 'wme-sitebuilder' ),
					],
				],
				'requiredPlugins' => [],
			],
			[
				'key'         => self::GOALS_CAREERS,
				'value'       => __( 'Share open positions to potential candidates', 'wme-sitebuilder' ),
				'description' => '',
				'icon'        => 'SupervisorAccount',
				'requiredPages' => [
					'careers' => [
						'title' => __( 'Careers', 'wme-sitebuilder' ),
					],
				],
				'requiredPlugins' => [],
			],
			[
				'key'         => self::GOALS_SERVICES,
				'value'       => __( 'Promote my services', 'wme-sitebuilder' ),
				'description' => '',
				'icon'        => 'ChatBubble',
				'requiredPages' => [
					'services' => [
						'title' => __( 'Services', 'wme-sitebuilder' ),
					],
				],
				'requiredPlugins' => [],
			],
			[
				'key'         => self::GOALS_PRICING_PLANS,
				'value'       => __( 'Share my pricing plans', 'wme-sitebuilder' ),
				'description' => __( 'A place to showcase each plan, with their benefits and prices.', 'wme-sitebuilder' ),
				'icon'        => 'PriceChange',
				'requiredPages' => [
					'pricing' => [
						'title' => __( 'Plans (Pricing)', 'wme-sitebuilder' ),
					],
				],
				'requiredPlugins' => [],
			],
		];

		return apply_filters( 'wme_sitebuilder_ftc_wizard_goals', $goals );
	}
}
