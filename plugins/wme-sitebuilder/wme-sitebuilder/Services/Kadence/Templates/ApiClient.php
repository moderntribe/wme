<?php

namespace Tribe\WME\Sitebuilder\Services\Kadence\Templates;

use StellarWP\PluginFramework\Exceptions\WPErrorException;
use WP_Error;

class ApiClient
{

	/**
	 * @var string $url The URL of the Kadence Template Patterns Cloud API.
	 */
	private $url = 'https://patterns.startertemplatecloud.com';

	/**
	 * Fetch the Kadence Template Patterns Cloud API
	 *
	 * @throws WPErrorException If an error occurs making the request.
	 *
	 * @return Array<string,mixed> An array containing all page templates sorted by type.Z
	 */
	public function fetch_page_patterns()
	{
		$pages = wp_cache_get( 'wme_ktp_pages' );

		if (! $pages) {
			$response = $this->fetch_patterns(Types::PAGES);
			$body = json_decode($response['body'], true);

			foreach ( TYPES::get_page_types() as $type ) {
				$pages[$type] = array_filter( $body, function ($item) use ($type) {
					return in_array( $type, array_keys($item['categories']));
				});
			}

			wp_cache_set( 'wme_ktp_pages', $pages, '', 60 * 60 * 24 );
		}

		// slug => string
		// name => string
		// categories => array (use as is)
		// keywords => array (use as is)
		// pro => bool
		// locked => bool
		// content => string (ignore)
		// html => string (ignore)
		// rows_htmls => gutenberg blocks
		// rows => array
		// description => string
		// image => url
		// imageW => int
		// imageH => int
		return $pages;
	}

	/**
	 * Fetch the Kadence Template Patterns Cloud API
	 *
	 * @param string  $type 	The type of pattern to fetch.
	 * @param mixed[] $args     Optional. WP HTTP API arguments, which will be merged with defaults.
	 *                          {@link https://developer.wordpress.org/reference/classes/WP_Http/request/#parameters}.
	 *
	 * @throws WPErrorException If an error occurs making the request.
	 *
	 * @return Array<string,mixed> An array containing the following keys: 'headers', 'body', 'response', 'cookies',
	 *                             and 'filename'. This is the same as {@see \WP_HTTP::request()}
	 */
	public function fetch_patterns(string $type, array $args = [])
	{
		if (!Types::is_valid_type($type)) {
			return new WP_Error('invalid_type', sprintf('The type %s is not valid.', $type));
		}

		$response = wp_remote_request(
			esc_url_raw(sprintf('%1$s/wp-json/kadence-cloud/v1/pages/?key=%2$s', $this->url, $type)),
			array_replace_recursive([
				'user-agent' => 'StellarWP/WME/PartnerCloud',
				'timeout'    => 30,
				'headers'    => [
					'Accept'        => 'application/json',
				],
			], $args)
		);

		if (is_wp_error($response)) {
			throw new WPErrorException($response);
		}

		return $response;
	}
}
