<?php

namespace Tribe\WME\Sitebuilder\Wizards;

use Tribe\WME\Sitebuilder\Concerns\StoresData;
use Tribe\WME\Sitebuilder\Services\Goals;
use Tribe\WME\Sitebuilder\Services\Kadence\Templates\ApiClient;

class FirstTimeConfiguration extends Wizard {

	use StoresData;

	const FIELD_LOGO             = 'logo';
	const FIELD_PASSWORD         = 'password';
	const FIELD_SITENAME         = 'siteName';
	const FIELD_TAGLINE          = 'tagLine';
	const FIELD_INDUSTRY         = 'industry';
	const FIELD_SUBINDUSTRY      = 'subIndustry';
	const FIELD_SITE_DESCRIPTION = 'siteDescription';
	const FIELD_SITE_PERSONALITY = 'sitePersonality';
	const FIELD_SITE_KEYWORDS    = 'siteKeywords';
	const FIELD_GOALS            = 'goals';
	const FIELD_TEMPLATE         = 'template';
	const FIELD_USERNAME         = 'username';

	const DATA_STORE_NAME        = '_sitebuilder_ftc';

	/**
	 * @var string
	 */
	protected $admin_page_slug = 'sitebuilder';

	/**
	 * @var string
	 */
	protected $wizard_slug = 'ftc';

	/**
	 * @var string
	 */
	protected $ajax_action = 'sitebuilder-wizard-ftc';

	/**
	 * @var array
	 */
	protected $fields = [];

	/**
	 * @var array
	 */
	public $errors = [];

	/**
	 * @var ApiClient
	 */
	protected $api_client;

	/**
	 * @var Goals
	 */
	protected $goals;

	/**
	 * Construct.
	 */
	public function __construct(ApiClient $api_client, Goals $goals) {
		$this->api_client = $api_client;
		$this->goals = $goals;

		parent::__construct();

		$this->add_ajax_action( 'wizard_started', [ $this, 'telemetryWizardStarted' ] );
		$this->add_ajax_action( 'validateUsername', [ $this, 'validateUsername' ] );
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
		parent::register_hooks();

		add_action( 'current_screen', [ $this, 'autoLaunch' ] );
		add_action( 'kadence-starter-templates/after_all_import_execution', [ $this, 'restoreLogoAfterKadenceImport' ] );
		add_action( 'wme_event_wizard_ftc_completed', [ $this, 'actionGoalSave' ] );
	}

	/**
	 * Telemetry: wizard started.
	 */
	public function telemetryWizardStarted() {
		do_action( 'wme_event_wizard_started', 'ftc' );

		return wp_send_json_success();
	}

	/**
	 * Get properties.
	 *
	 * @return array
	 */
	public function props() {
		return [
			'username'     => $this->getUsername(),
			'completed'    => $this->isComplete(),
			'autoLaunch'   => false,
			'canBeClosed'  => $this->isComplete(),
			'adminUrl'     => admin_url(),
			'goal_choices' => $this->goals->getChoices(),
			'site'         => [
				'siteName'        => $this->getSitename(),
				'tagline'         => $this->getTagline(),
				'logo'            => [
					'id'  => $this->getLogoId(),
					'url' => $this->getLogoUrl(),
				],
				'industry'        => $this->getIndustry(),
				'subIndustry'     => $this->getSubIndustry(),
				'siteDescription' => $this->getSiteDescription(),
				'sitePersonality' => $this->getSitePersonality(),
				'siteKeywords'    => $this->getSiteKeywords(),
				'goals'           => $this->getGoals(),
				'template'        => $this->getTemplate(),
			],
		];
	}

	/**
	 * AJAX sub-action to validate the provided username.
	 */
	public function validateUsername() {
		$username = sanitize_text_field( $_POST[ self::FIELD_USERNAME ] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		$errors   = [];

		if ( ! $this->isUsernameValid( $username ) ) {
			$errors[] = __( 'Username not valid.', 'wme-sitebuilder' );
		}

		if ( ! empty( $errors ) ) {
			wp_send_json_error( $errors, 400 );
		}

		wp_send_json_success();
	}

	/**
	 * Finish the wizard.
	 */
	public function finish() {
		$fields = [
			self::FIELD_LOGO,
			self::FIELD_SITENAME,
			self::FIELD_TAGLINE,
			self::FIELD_INDUSTRY,
			self::FIELD_SUBINDUSTRY,
			self::FIELD_SITE_DESCRIPTION,
			self::FIELD_SITE_PERSONALITY,
			self::FIELD_SITE_KEYWORDS,
			self::FIELD_GOALS,
			self::FIELD_TEMPLATE,
		];

		foreach ( $fields as $field ) {
			$method_name = sprintf( 'set%s', ucfirst( $field ) );

			if ( ! method_exists( $this, $method_name ) ) {
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_trigger_error
				trigger_error( sprintf( 'Method <code>%s</code> to save <code>%s</code> field is not defined.', esc_html( $method_name ), esc_html( $field ) ), E_USER_WARNING );

				continue;
			}

			$callable = [ $this, $method_name ];

			if ( ! is_callable( $callable ) ) {
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_trigger_error
				trigger_error( sprintf( 'Method <code>%s</code> to save <code>%s</code> field is defined but not callable.', esc_html( $method_name ), esc_html( $field ) ), E_USER_WARNING );

				continue;
			}

			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			if ( ! array_key_exists( $field, $_POST ) ) {
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_trigger_error
				trigger_error( sprintf( 'Field <code>%s</code> is absent in $_POST global.', esc_html( $field ) ), E_USER_WARNING );

				continue;
			}

			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			call_user_func( $callable, $_POST[ $field ] );
		}

		$this->getData()->set( 'complete', true )->save();

		do_action( 'wme_event_wizard_ftc_completed' );
		do_action( 'wme_event_wizard_completed', 'ftc' );

		$this->setUserCredentials();

		wp_send_json_success();
	}

	/**
	 * Check if Wizard has been completed.
	 *
	 * @return bool
	 */
	public function isComplete() {
		return (bool) $this->getData()->get( 'complete', false );
	}

	/**
	 * Auto launch the wizard.
	 *
	 * @action current_screen
	 */
	public function autoLaunch() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}

		if ( ! is_admin() || $this->isComplete() ) {
			return;
		}

		// Allow disabling the auto launch of the First Time Configuration Wizard.
		if ( ! apply_filters( 'wme_sitebuilder_autolaunch_wizard', true ) ) {
			return;
		}

		$screen = get_current_screen();

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! empty( $screen ) && sprintf( 'toplevel_page_%s', $this->admin_page_slug ) === $screen->id ) {
			return;
		}

		$redirect_url  = add_query_arg( 'page', $this->admin_page_slug, admin_url( 'admin.php' ) );
		$redirect_url .= sprintf( '#/wizard/%s', $this->wizard_slug );

		wp_safe_redirect( $redirect_url );

		exit;
	}

	/**
	 * Returns the current users user_login.
	 *
	 * @return string
	 */
	public function getUsername() {
		$user = wp_get_current_user();

		if ( empty( $user->user_login ) ) {
			return '';
		}

		return $user->user_login;
	}

	/**
	 * Returns the logo id if a logo exists, or 0.
	 *
	 * @return int
	 */
	public function getLogoId() {
		if ( empty( $this->fields['logo_id'] ) ) {
			$this->fields['logo_id'] = absint( get_option( 'site_logo', 0 ) );
		}

		return $this->fields['logo_id'];
	}

	/**
	 * Returns the logo url if a logo exists, an empty string otherwise.
	 *
	 * @return string
	 */
	public function getLogoUrl() {
		if ( empty( $this->getLogoId() ) ) {
			return '';
		}

		$url = wp_get_attachment_image_url( $this->getLogoId(), 'full' );

		if ( empty( $url ) ) {
			return '';
		}

		return $url;
	}

	/**
	 * Returns the logo id if a logo exists, or 0.
	 *
	 * @return int
	 */
	public function getLogo() {
		if ( empty( $this->fields[ self::FIELD_LOGO ] ) ) {
			$this->fields[ self::FIELD_LOGO ] = get_option( 'site_logo', 0 );
		}

		return (int) $this->fields[ self::FIELD_LOGO ];
	}

	/**
	 * Set logo ID.
	 *
	 * @param int $logo
	 */
	public function setLogo( $logo ) {
		if ( empty( $logo ) ) {
			update_option( 'site_logo', null );
			$this->getData()->set( 'logo', null );
			return;
		}

		$logo = absint( filter_var( $logo, FILTER_SANITIZE_NUMBER_INT ) );

		if ( empty( $logo ) ) {
			$this->errors[] = [ self::FIELD_LOGO => __( 'Invalid Logo', 'wme-sitebuilder' ) ];
			return;
		}

		if ( $logo === $this->getLogo() ) {
			return;
		}

		$this->getData()->set( 'logo', $logo );

		if ( update_option( 'site_logo', $logo ) ) {
			return;
		}

		$this->errors[] = [ self::FIELD_LOGO => __( 'Unable to save the Logo', 'wme-sitebuilder' ) ];
	}

	/**
	 * Get the current site name.
	 *
	 * @return string
	 */
	public function getSitename() {
		if ( empty( $this->fields[ self::FIELD_SITENAME ] ) ) {
			$this->fields[ self::FIELD_SITENAME ] = get_bloginfo( 'name' );
		}

		return $this->fields[ self::FIELD_SITENAME ];
	}

	/**
	 * Set the site name.
	 *
	 * @param string $sitename
	 */
	public function setSitename( $sitename ) {
		$sitename = filter_var( $sitename, FILTER_SANITIZE_FULL_SPECIAL_CHARS );

		if ( $sitename === $this->getSitename() ) {
			return;
		}

		$this->getData()->set( 'blogname', $sitename );

		if ( update_option( 'blogname', $sitename ) ) {
			return;
		}

		$this->errors[] = [ self::FIELD_SITENAME => __( 'Unable to save the Site Name', 'wme-sitebuilder' ) ];
	}

	/**
	 * Get the current site tagline.
	 *
	 * @return string
	 */
	public function getTagline() {
		if ( empty( $this->fields[ self::FIELD_TAGLINE ] ) ) {
			$this->fields[ self::FIELD_TAGLINE ] = get_bloginfo( 'blogdescription' );
		}

		return $this->fields[ self::FIELD_TAGLINE ];
	}

	/**
	 * Set the site description (tagLine).
	 *
	 * @param string $tagline
	 */
	public function setTagline( $tagline ) {
		$tagline = filter_var( $tagline, FILTER_SANITIZE_FULL_SPECIAL_CHARS );

		if ( $tagline === $this->getTagline() ) {
			return;
		}

		$this->getData()->set( 'blogdescription', $tagline );

		if ( update_option( 'blogdescription', $tagline ) ) {
			return;
		}

		$this->errors[] = [ self::FIELD_TAGLINE => __( 'Unable to save the Site Description', 'wme-sitebuilder' ) ];
	}

	/**
	 * Get the site industry.
	 *
	 * @return string
	 */
	public function getIndustry() {
		if ( empty( $this->fields[ self::FIELD_INDUSTRY ] ) ) {
			$this->fields[ self::FIELD_INDUSTRY ] = $this->getData()->get( self::FIELD_INDUSTRY );
		}

		return $this->fields[ self::FIELD_INDUSTRY ] ?? '';
	}

	/**
	 * Set the site industry.
	 *
	 * @param string $industry
	 */
	public function setIndustry( $industry ) {
		$industry = filter_var( $industry, FILTER_SANITIZE_FULL_SPECIAL_CHARS );

		if ( $industry === $this->getIndustry() ) {
			return;
		}

		$this->getData()->set( self::FIELD_INDUSTRY, $industry );
	}

	/**
	 * Get the site sub-industry.
	 *
	 * @return string
	 */
	public function getSubIndustry() {
		if ( empty( $this->fields[ self::FIELD_SUBINDUSTRY ] ) ) {
			$this->fields[ self::FIELD_SUBINDUSTRY ] = $this->getData()->get( self::FIELD_SUBINDUSTRY );
		}

		return $this->fields[ self::FIELD_SUBINDUSTRY ] ?? '';
	}

	/**
	 * Set the site sub-industry.
	 *
	 * @param string $subindustry
	 */
	public function setSubIndustry( $subindustry ) {
		$subindustry = filter_var( $subindustry, FILTER_SANITIZE_FULL_SPECIAL_CHARS );

		if ( $subindustry === $this->getSubindustry() ) {
			return;
		}

		$this->getData()->set( self::FIELD_SUBINDUSTRY, $subindustry );
	}

	/**
	 * Get the site description.
	 *
	 * @return string
	 */
	public function getSiteDescription() {
		if ( empty( $this->fields[ self::FIELD_SITE_DESCRIPTION ] ) ) {
			$this->fields[ self::FIELD_SITE_DESCRIPTION ] = $this->getData()->get( self::FIELD_SITE_DESCRIPTION );
		}

		return $this->fields[ self::FIELD_SITE_DESCRIPTION ] ?? '';
	}

	/**
	 * Set the site description.
	 *
	 * @param string $description
	 */
	public function setSiteDescription( $description ) {
		$description = filter_var( $description, FILTER_SANITIZE_FULL_SPECIAL_CHARS );

		if ( $description === $this->getSiteDescription() ) {
			return;
		}

		$this->getData()->set( self::FIELD_SITE_DESCRIPTION, $description );
	}

	/**
	 * Get the site personality.
	 *
	 * @return string
	 */
	public function getSitePersonality() {
		if ( empty( $this->fields[ self::FIELD_SITE_PERSONALITY ] ) ) {
			$this->fields[ self::FIELD_SITE_PERSONALITY ] = $this->getData()->get( self::FIELD_SITE_PERSONALITY );
		}

		return $this->fields[ self::FIELD_SITE_PERSONALITY ] ?? '';
	}

	/**
	 * Set the site personality.
	 *
	 * @param string $personality
	 */
	public function setSitePersonality( $personality ) {
		$personality = filter_var( $personality, FILTER_SANITIZE_FULL_SPECIAL_CHARS );

		if ( $personality === $this->getSitePersonality() ) {
			return;
		}

		$this->getData()->set( self::FIELD_SITE_PERSONALITY, $personality );
	}

	/**
	 * Get the site keywords.
	 *
	 * @return array
	 */
	public function getSiteKeywords(): array {
		if ( empty( $this->fields[ self::FIELD_SITE_KEYWORDS ] ) ) {
			$this->fields[ self::FIELD_SITE_KEYWORDS ] = $this->getData()->get( self::FIELD_SITE_KEYWORDS );
		}

		$keywords = $this->fields[ self::FIELD_SITE_KEYWORDS ] ?? '';
		$keywords = explode( ', ', $keywords) ?? [];

		return array_filter( $keywords );
	}

	/**
	 * Set the site keywords.
	 *
	 * @param array $keywords
	 */
	public function setSiteKeywords( array $keywords ) {
		$keywords = filter_var_array( $keywords, FILTER_SANITIZE_FULL_SPECIAL_CHARS );
		$keywords = implode( ', ', $keywords );

		$this->getData()->set( self::FIELD_SITE_KEYWORDS, $keywords );
	}

	/**
	 * Get the goals.
	 *
	 * @return array
	 */
	public function getGoals(): array {
		if ( empty( $this->fields[ self::FIELD_GOALS ] ) ) {
			$this->fields[ self::FIELD_GOALS ] = $this->getData()->get( self::FIELD_GOALS );
		}

		$goals = $this->fields[ self::FIELD_GOALS ] ?? '';
		$goals = explode( ', ', $goals) ?? [];

		return array_filter( $goals );
	}

	/**
	 * Set the goals.
	 *
	 * @param array $goals
	 */
	public function setGoals( array $goals ) {
		$goals = filter_var_array( $goals, FILTER_SANITIZE_FULL_SPECIAL_CHARS );
		$goals = implode( ', ', $goals );

		$this->getData()->set( self::FIELD_GOALS, $goals );
	}

	/**
	 * Get the  template.
	 *
	 * @return string
	 */
	public function getTemplate() {
		if ( empty( $this->fields[ self::FIELD_TEMPLATE ] ) ) {
			$this->fields[ self::FIELD_TEMPLATE ] = get_option( 'site_template', '' );
		}

		return $this->fields[ self::FIELD_TEMPLATE ];
	}

	/**
	 * Set the template.
	 *
	 * @param string $template
	 */
	public function setTemplate( $template ) {
		$template = filter_var( $template, FILTER_SANITIZE_FULL_SPECIAL_CHARS );

		if ( $template === $this->getTemplate() ) {
			return;
		}

		$this->getData()->set( 'site_template', $template );
	}

	/**
	 * Set user's credentials.
	 */
	protected function setUserCredentials() {
		$user = wp_get_current_user();

		$updated_password = false;
		$updated_username = false;

		// phpcs:disable WordPress.Security.NonceVerification.Missing
		if ( isset( $_POST[ self::FIELD_PASSWORD ] ) ) {
			$password = sanitize_text_field( $_POST[ self::FIELD_PASSWORD ] );
			wp_set_password( $password, $user->ID );
			$updated_password = true;
		}

		if ( isset( $_POST[ self::FIELD_USERNAME ] ) ) {
			$username = sanitize_text_field( $_POST[ self::FIELD_USERNAME ] );

			if ( $user->user_login !== $username && $this->isUsernameValid( $username ) ) {
				global $wpdb;

				$updated_username = $wpdb->update(
					$wpdb->users,
					[ 'user_login' => $username ],
					[ 'ID' => $user->ID ]
				);
			}
		}
		// phpcs:enable

		if ( ! $updated_password && ! $updated_username ) {
			return;
		}

		do_action( 'wme_sitebuilder_user_password_updated', $user->ID );

		clean_user_cache( $user->ID );

		$user = wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID );

		do_action( 'wp_login', $user->user_login, $user );
	}

	/**
	 * Validates the username entered.
	 *
	 * @param string $username The username to validate.
	 *
	 * @return bool True if the username is valid, false otherwise.
	 */
	protected function isUsernameValid( $username ) {
		if ( ! validate_username( $username ) ) {
			return false;
		}

		$illegal_usernames = (array) apply_filters('illegal_user_logins', [
			'adm',
			'admin',
			'admin1',
			'hostname',
			'manager',
			'qwerty',
			'root',
			'support',
			'sysadmin',
			'test',
			'user',
			'webmaster',
		]);

		$illegal_usernames = array_map( 'strtolower', $illegal_usernames );

		if ( in_array( mb_strtolower( $username ), $illegal_usernames, true ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Restore set logo after Kadence template import.
	 *
	 * @param string[] $selected_import_files
	 */
	public function restoreLogoAfterKadenceImport( $selected_import_files ) {
		$site_logo = get_option( 'site_logo', null );
		$ftc_logo  = $this->getData()->get( 'logo' );

		if ( $site_logo === $ftc_logo ) {
			return;
		}

		update_option( 'site_logo', $ftc_logo );
	}

	/**
	 * On save, we should create some pages based on the goals.
	 */
	public function actionGoalSave() {
		$goals = $this->getGoals();

		if ( empty( $goals ) ) {
			return;
		}

		$goalChoices = $this->goals->getChoices();
		$page_templates = $this->api_client->fetch_page_patterns();

		foreach ( $goals as $selected ) {
			$goal = array_filter( $goalChoices, function ( $choice ) use ( $selected ) {
				return $choice['key'] === $selected;
			} );

			if ( empty( $goal ) ) {
				continue;
			}

			$goal = array_shift( $goal );

			if ( empty( $goal['requiredPages'] ) ) {
				continue;
			}

			foreach ( $goal['requiredPages'] as $slug => $args ) {
				if ( ! empty( $page_templates[ $slug ] ) ) {
					$key = array_rand( $page_templates[ $slug ]);
					$args['content'] = implode( PHP_EOL, array_filter( wp_list_pluck($page_templates[ $slug ][$key]['rows'], 'pattern_content') ) );
				}
				$this->createPage( $slug, $args );
			}
		}
	}

	/**
	 * Create a page if it doesn't exist.
	 *
	 * @param string $slug
	 * @param array $args
	 */
	protected function createPage( string $slug, array $args ) {
		$page = get_page_by_path( $slug );

		if ( ! empty( $page ) ) {
			return;
		}

		$page = [
			'post_title'   => $args['title'],
			'post_name'    => $slug,
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_content' => $args['content'],
		];

		$page_id = wp_insert_post( $page );

		if ( 'home' === $slug ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', (int) $page_id );
		}
	}
}
