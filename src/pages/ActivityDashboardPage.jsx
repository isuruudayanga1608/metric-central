import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import ExcelEmbed from '../components/ExcelEmbed';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import AccessErrorState from '../components/AccessErrorState';
import { getActivityById } from '../config/activities';
import {
  isValidEnvironmentType,
  isValidMonth,
  isValidYear,
  resolveEmbedView,
} from '../services/embedResolver';
import styles from './ActivityDashboardPage.module.css';

// If the iframe hasn't fired its load event within this window, stop
// showing the loading spinner forever and offer a manual retry instead.
const LOAD_TIMEOUT_MS = 20000;

function ActivityDashboardPage() {
  const { activityId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activity = getActivityById(activityId);

  const rawYear = searchParams.get('year');
  const rawMonth = searchParams.get('month');
  const rawEnvironment = searchParams.get('environment');

  const year = isValidYear(rawYear) ? rawYear : null;
  const month = isValidMonth(rawMonth) ? rawMonth : null;
  const environment = isValidEnvironmentType(rawEnvironment) ? rawEnvironment : null;

  // An unrecognized query-string value (typo, stale link, tampering) is
  // dropped rather than acted on, so the URL self-heals on the next render.
  useEffect(() => {
    const hasInvalidValue =
      (rawYear && !year) || (rawMonth && !month) || (rawEnvironment && !environment);
    if (!hasInvalidValue) return;

    const next = new URLSearchParams(searchParams);
    if (rawYear && !year) next.delete('year');
    if (rawMonth && !month) next.delete('month');
    if (rawEnvironment && !environment) next.delete('environment');
    setSearchParams(next, { replace: true });
    // Only re-run when the raw query values themselves change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawYear, rawMonth, rawEnvironment]);

  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [accessIssueReported, setAccessIssueReported] = useState(false);
  const timeoutRef = useRef(null);

  const resolution = useMemo(
    () => resolveEmbedView(activityId, { year, month, environment }),
    [activityId, year, month, environment]
  );

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    setLoadTimedOut(false);
    if (resolution.status === 'ready') {
      timeoutRef.current = setTimeout(() => setLoadTimedOut(true), LOAD_TIMEOUT_MS);
    } else {
      setIsRefreshing(false);
    }
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolution.status, resolution.embedUrl, refreshKey]);

  if (!activity) {
    return (
      <div className={styles.page}>
        <AnimatedBackground />
        <Header />
        <main className={styles.main}>
          <ErrorState message="The requested activity is not available." showBackLink />
        </main>
      </div>
    );
  }

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleActivityChange = (nextActivityId) => {
    if (!nextActivityId || nextActivityId === activityId) return;
    const query = searchParams.toString();
    navigate(`/activities/${nextActivityId}${query ? `?${query}` : ''}`);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleRefresh = () => {
    clearTimeout(timeoutRef.current);
    setLoadTimedOut(false);
    setAccessIssueReported(false);
    setIsRefreshing(true);
    setRefreshKey((key) => key + 1);
  };

  const handleIframeLoad = () => {
    clearTimeout(timeoutRef.current);
    setLoadTimedOut(false);
    setIsRefreshing(false);
    setLastRefreshed(new Date());
  };

  const renderPanel = () => {
    if (accessIssueReported) {
      return <AccessErrorState onDismiss={() => setAccessIssueReported(false)} />;
    }

    if (loadTimedOut) {
      return <ErrorState onRetry={handleRefresh} />;
    }

    if (resolution.status === 'incomplete') {
      return <EmptyState />;
    }

    // 'unsupported-activity' cannot happen here (already handled above), and
    // 'missing'/'ready' both go through ExcelEmbed: a null embedUrl renders
    // its own missing-configuration message.
    return (
      <ExcelEmbed
        embedUrl={resolution.status === 'ready' ? resolution.embedUrl : null}
        title={`${activity.displayName} Excel dashboard`}
        refreshKey={refreshKey}
        onLoad={handleIframeLoad}
      />
    );
  };

  const canReportAccessIssue = resolution.status === 'ready' && !loadTimedOut && !accessIssueReported;

  return (
    <div className={styles.page}>
      <AnimatedBackground />
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>{activity.pageTitle}</h1>

        <FilterBar
          activityId={activityId}
          year={year ?? ''}
          month={month ?? ''}
          environment={environment ?? ''}
          onYearChange={(value) => updateFilter('year', value)}
          onMonthChange={(value) => updateFilter('month', value)}
          onEnvironmentChange={(value) => updateFilter('environment', value)}
          onActivityChange={handleActivityChange}
          onReset={handleReset}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <div className={styles.panelArea} aria-live="polite">
          {renderPanel()}
        </div>

        <div className={styles.metaRow}>
          {lastRefreshed && (
            <p className={styles.timestamp}>
              View refreshed: {lastRefreshed.toLocaleString()}
            </p>
          )}
          {canReportAccessIssue && (
            <button
              type="button"
              className={styles.reportLink}
              onClick={() => setAccessIssueReported(true)}
            >
              Seeing a sign-in prompt inside the dashboard?
            </button>
          )}
        </div>
      </main>

      <Link to="/activities" className={styles.backButton}>
        Back
      </Link>
    </div>
  );
}

export default ActivityDashboardPage;
