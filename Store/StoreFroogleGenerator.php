<?php

require_once 'AtomFeed/AtomFeedAuthor.php';
require_once 'AtomFeed/AtomFeedLink.php';
require_once 'Store/StoreProductFileGenerator.php';
require_once 'Store/StoreFroogleFeed.php';
require_once 'Store/StoreFroogleFeedEntry.php';

/**
 * @package   Store
 * @copyright 2008-2011 silverorange
 * @license   http://www.gnu.org/copyleft/lesser.html LGPL License 2.1
 */
abstract class StoreFroogleGenerator extends StoreProductFileGenerator
{
	// {{{ public function generate()

	public function generate()
	{
		$feed = $this->getFeed();
		$this->addEntries($feed);

		ob_start();
		$feed->display();
		return ob_get_clean();
	}

	// }}}
	// {{{ protected function getFeed()

	protected function getFeed()
	{
		$feed = new StoreFroogleFeed();

		$feed->title = sprintf(Store::_('%s Products'),
			$this->config->site->title);

		$feed->addAuthor(new AtomFeedAuthor($this->config->site->title));
		$feed->link = new AtomFeedLink($this->getBaseHref(), 'self');
		$feed->id = sprintf('tag:%s,%s:/products/',
			substr($this->config->uri->absolute_base, 7), // get domain
			$this->getSiteInceptionDate());

		return $feed;
	}

	// }}}
	// {{{ protected function addEntries()

	/**
	 * Add atom entries to the feed
	 */
	protected function addEntries(StoreFroogleFeed $feed)
	{
		foreach ($this->getItems() as $item) {
			$feed->addEntry($this->getEntry($item));
		}
	}

	// }}}
	// {{{ abstract protected function getEntry()

	/**
	 * @return StoreFroogleFeedEntry
	 */
	abstract protected function getEntry(StoreItem $item);

	// }}}
	// {{{ abstract protected function getSiteInceptionDate()

	/**
	 * @return string ISO-8601 date (yyy-mm-dd).
	 */
	abstract protected function getSiteInceptionDate();

	// }}}
	// {{{ protected function getAvailability()

	protected function getAvailability(StoreItem $item)
	{
		$status = $item->getStatus();

		// normalize to Google Merchant Center Product Feed accepted values.
		// http://support.google.com/merchants/bin/answer.py?hl=en&answer=188494#availability
		// note that in stock should only be used when shipping takes place
		// within 3 days. also available, but rarely used by any of our sites:
		// 'available for order', 'preorder'
		switch ($status->shortname) {
		case 'available':
			$availability = 'in stock';
			break;

		case 'outofstock':
			$availability = 'out of stock';
			break;

		default:
			throw new SiteException(sprintf(
				'Froogle availability string missing for status ‘%s’',
				$status->shortname));

			break;
		}

		return $availability;
	}

	// }}}
}

?>
