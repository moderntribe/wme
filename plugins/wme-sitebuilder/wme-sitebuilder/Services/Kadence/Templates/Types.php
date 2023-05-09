<?php

namespace Tribe\WME\Sitebuilder\Services\Kadence\Templates;

final class Types
{
	/**
	 * The available types of patterns.
	 */
	public const SECTIONS = 'sections';
	public const PAGES = 'pages';

	/**
	 * The available types of pages.
	 */
	public const HOME = 'home';
	public const SERVICES = 'services';
	public const CONTACT = 'contact';
	public const ABOUT = 'about';
	public const CAREERS = 'careers';
	public const PRICING = 'pricing';
	public const BLOG = 'blog';

	/**
	 * Get the available types of patterns.
	 *
	 * @return string[]
	 */
	public static function get_types(): array
	{
		return [
			self::SECTIONS,
			self::PAGES
		];
	}

	/**
	 * Check if a type is valid.
	 *
	 * @param string $type The type to check.
	 *
	 * @return bool
	 */
	public static function is_valid_type(string $type): bool
	{
		return in_array($type, self::get_types());
	}

	/**
	 * Get the available types of pages.
	 *
	 * @return string[]
	 */
	public static function get_page_types(): array
	{
		return [
			self::HOME,
			self::SERVICES,
			self::CONTACT,
			self::ABOUT,
			self::CAREERS,
			self::PRICING,
			self::BLOG
		];
	}
}
