import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Button,
  Link,
  Grid,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Language as LanguageIcon,
  MenuBook as MenuBookIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  GitHub as GitHubIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';

const Manual: React.FC = () => {
  const { language } = useLanguage();

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box maxWidth="lg" mx="auto">
      <Typography variant="h3" component="h1" gutterBottom align="center">
        {language === 'ja' ? 'MTG Cubes ヘルプ・マニュアル' : 'MTG Cubes Help & Manual'}
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          {language === 'ja' 
            ? 'MTGキューブ管理システムの使い方をご案内します。詳細なマニュアルも併せてご活用ください。'
            : 'Guide to using the MTG Cube Management System. Please also make use of the detailed manuals.'}
        </Typography>
      </Alert>

      {/* ドキュメントへのクイックアクセス */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {language === 'ja' ? '📚 ドキュメント' : '📚 Documentation'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<MenuBookIcon />}
              endIcon={<OpenInNewIcon />}
              onClick={() => openExternalLink('https://github.com/Yuunonine/mtgcubemanager/blob/main/docs/USER_GUIDE.md')}
              sx={{ height: '100%', flexDirection: 'column', py: 2 }}
            >
              <Typography variant="subtitle2">
                {language === 'ja' ? 'ユーザーガイド' : 'User Guide'}
              </Typography>
              <Typography variant="caption" sx={{ mt: 1 }}>
                {language === 'ja' ? '基本操作から高度な機能まで' : 'From basic operations to advanced features'}
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CodeIcon />}
              endIcon={<OpenInNewIcon />}
              onClick={() => openExternalLink('https://github.com/Yuunonine/mtgcubemanager/blob/main/docs/DEVELOPER.md')}
              sx={{ height: '100%', flexDirection: 'column', py: 2 }}
            >
              <Typography variant="subtitle2">
                {language === 'ja' ? '開発者ガイド' : 'Developer Guide'}
              </Typography>
              <Typography variant="caption" sx={{ mt: 1 }}>
                {language === 'ja' ? 'カスタマイズ・拡張方法' : 'Customization & Extension'}
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ApiIcon />}
              endIcon={<OpenInNewIcon />}
              onClick={() => openExternalLink('https://github.com/Yuunonine/mtgcubemanager/blob/main/docs/API.md')}
              sx={{ height: '100%', flexDirection: 'column', py: 2 }}
            >
              <Typography variant="subtitle2">
                {language === 'ja' ? 'API リファレンス' : 'API Reference'}
              </Typography>
              <Typography variant="caption" sx={{ mt: 1 }}>
                {language === 'ja' ? 'REST API 仕様書' : 'REST API Specification'}
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GitHubIcon />}
              endIcon={<OpenInNewIcon />}
              onClick={() => openExternalLink('https://github.com/Yuunonine/mtgcubemanager')}
              sx={{ height: '100%', flexDirection: 'column', py: 2 }}
            >
              <Typography variant="subtitle2">
                {language === 'ja' ? 'GitHub' : 'GitHub'}
              </Typography>
              <Typography variant="caption" sx={{ mt: 1 }}>
                {language === 'ja' ? 'ソースコード・Issue報告' : 'Source Code & Issues'}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            {language === 'ja' ? 'はじめに - MTG Cubesとは？' : 'Getting Started - What is MTG Cubes?'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {language === 'ja' ? (
              <>
                <strong>MTG Cubes</strong>は、Magic: The Gatheringのキューブドラフト用カードプール管理システムです。
                キューブとは、厳選されたカード（通常360～540枚）で構成される特別なドラフト環境で、
                プレイヤーが繰り返し楽しめるドラフト体験を提供します。
              </>
            ) : (
              <>
                <strong>MTG Cubes</strong> is a card pool management system for Magic: The Gathering cube drafts.
                A cube is a special draft environment composed of carefully selected cards (usually 360-540 cards)
                that provides a repeatable draft experience for players.
              </>
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {language === 'ja' 
              ? 'このアプリケーションでは、キューブの管理、カードの検索・追加、セット選択、詳細なバランス分析を行うことができます。'
              : 'This application allows you to manage cubes, search and add cards, select sets, and perform detailed balance analysis.'}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            <PlayArrowIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {language === 'ja' ? 'クイックスタート' : 'Quick Start'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {language === 'ja' ? '新しいキューブを作成してカードを追加する基本的な流れ：' : 'Basic flow to create a new cube and add cards:'}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Typography variant="h6" color="primary">1</Typography></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? '「新しいキューブを作成」をクリック' : 'Click "Create New Cube"'}
                secondary={language === 'ja' ? 'メイン画面のボタンから新規キューブを作成' : 'Create a new cube from the main screen button'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Typography variant="h6" color="primary">2</Typography></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? 'キューブ情報を入力' : 'Enter cube information'}
                secondary={language === 'ja' ? '名前と説明を入力してキューブを作成' : 'Enter name and description to create the cube'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Typography variant="h6" color="primary">3</Typography></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? 'カードを検索・追加' : 'Search and add cards'}
                secondary={language === 'ja' ? '日本語・英語でカードを検索してキューブに追加' : 'Search for cards in Japanese/English and add to cube'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Typography variant="h6" color="primary">4</Typography></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? 'バランスを分析' : 'Analyze balance'}
                secondary={language === 'ja' ? '分析タブでカラーバランスやマナカーブを確認' : 'Check color balance and mana curve in Analysis tab'}
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            <SearchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {language === 'ja' ? 'カードの検索と追加' : 'Card Search & Adding'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              {language === 'ja' ? 'キューブにカードを追加する手順：' : 'Steps to add cards to your cube:'}
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  {language === 'ja' ? 'ステップ1: カード検索' : 'Step 1: Card Search'}
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary={language === 'ja' ? '検索ボックスにカード名を入力' : 'Enter card name in search box'}
                      secondary={language === 'ja' ? '日本語名・英語名・Scryfall構文に対応' : 'Supports Japanese, English names, and Scryfall syntax'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary={language === 'ja' ? '検索ボタンまたはEnterキーで検索実行' : 'Click search button or press Enter'}
                      secondary={language === 'ja' ? 'ページング機能付きで大量の結果も効率的に表示' : 'Efficient display of large results with pagination'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />
                  {language === 'ja' ? 'ステップ2: セット選択（新機能）' : 'Step 2: Set Selection (New Feature)'}
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary={language === 'ja' ? '歯車アイコン（⚙）でセット選択' : 'Click gear icon (⚙) for set selection'}
                      secondary={language === 'ja' ? '同じカードでも異なるセット版の画像を選択可能' : 'Choose different set versions of the same card'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary={language === 'ja' ? 'セット選択ダイアログで希望する版を選択' : 'Select desired version in set selection dialog'}
                      secondary={language === 'ja' ? 'セット名・発売日・コレクター番号・画像を確認可能' : 'View set name, release date, collector number, and artwork'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  {language === 'ja' ? 'ステップ3: カード追加' : 'Step 3: Add Card'}
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary={language === 'ja' ? '通常の「追加」または「セット選択後追加」' : 'Regular \"Add\" or \"Add with Set Selection\"'}
                      secondary={language === 'ja' ? '重複チェック機能で同一カードの重複を防止' : 'Duplicate checking prevents adding the same card twice'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>{language === 'ja' ? '検索のコツ：' : 'Search Tips:'}</strong>
                <br />• {language === 'ja' ? '日本語・英語どちらでも検索可能' : 'Search in both Japanese and English'}
                <br />• {language === 'ja' ? '高度な検索：「cmc:3」（マナコスト3）、「t:creature」（クリーチャー）' : 'Advanced search: \"cmc:3\" (mana cost 3), \"t:creature\" (creatures)'}
                <br />• {language === 'ja' ? '部分一致：「稲妻」で「連鎖稲妻」なども検索' : 'Partial matching: \"Lightning\" finds \"Lightning Bolt\", etc.'}
                <br />• {language === 'ja' ? 'セット指定：「set:neo」（神河輝ける世界）' : 'Set filtering: \"set:neo\" (Kamigawa: Neon Dynasty)'}
              </Typography>
            </Alert>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {language === 'ja' ? '多言語対応' : 'Multi-language Support'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {language === 'ja' ? '日本語・英語の両方に対応した機能：' : 'Features supporting both Japanese and English:'}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><LanguageIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? 'UI言語切り替え' : 'UI Language Toggle'}
                secondary={language === 'ja' ? '右上の地球アイコン（🌐）で日本語⇔英語を瞬時に切り替え' : 'Click globe icon (🌐) in top right to switch between Japanese⇔English'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><SearchIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? 'バイリンガル検索' : 'Bilingual Search'}
                secondary={language === 'ja' ? 'カード名を日本語・英語どちらでも検索可能' : 'Search card names in both Japanese and English'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? 'カード情報翻訳' : 'Card Information Translation'}
                secondary={language === 'ja' ? 'カード名・タイプ・テキスト・レアリティを自動翻訳' : 'Auto-translate card names, types, text, and rarity'}
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            <DeleteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {language === 'ja' ? 'キューブ管理' : 'Cube Management'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {language === 'ja' ? 'キューブとカードの管理機能：' : 'Cube and card management features:'}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? 'カードの削除' : 'Remove Cards'}
                secondary={language === 'ja' ? '各カードの削除ボタン（🗑️）で個別削除' : 'Individual removal with delete button (🗑️) on each card'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? 'カード詳細表示' : 'Card Detail View'}
                secondary={language === 'ja' ? 'カードクリックで詳細情報・大画像・価格を表示' : 'Click card to view detailed info, large image, and price'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Typography variant="body2" color="text.secondary">📊</Typography></ListItemIcon>
              <ListItemText 
                primary={language === 'ja' ? '表示モード' : 'Display Modes'}
                secondary={language === 'ja' ? 'グリッド表示・リスト表示を切り替え可能' : 'Switch between grid view and list view'}
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {language === 'ja' ? 'キューブ分析機能' : 'Cube Analysis Features'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {language === 'ja' 
              ? '「Analysis」タブでキューブの詳細なバランス分析を確認できます：'
              : 'View detailed cube balance analysis in the "Analysis" tab:'}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {language === 'ja' ? '分析項目：' : 'Analysis Categories:'}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              <Chip label={language === 'ja' ? '色バランス' : 'Color Balance'} variant="outlined" />
              <Chip label={language === 'ja' ? 'マナカーブ' : 'Mana Curve'} variant="outlined" />
              <Chip label={language === 'ja' ? 'カードタイプ分布' : 'Card Type Distribution'} variant="outlined" />
              <Chip label={language === 'ja' ? 'レアリティ分布' : 'Rarity Distribution'} variant="outlined" />
              <Chip label={language === 'ja' ? 'パワーレベル' : 'Power Level'} variant="outlined" />
            </Box>
          </Box>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                {language === 'ja' ? '各分析の見方：' : 'How to Read Each Analysis:'}
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary={language === 'ja' ? '色バランス' : 'Color Balance'}
                    secondary={language === 'ja' 
                      ? '白、青、黒、赤、緑、多色、無色カードの分布を円グラフで表示'
                      : 'Pie chart showing distribution of White, Blue, Black, Red, Green, Multicolor, and Colorless cards'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={language === 'ja' ? 'マナカーブ' : 'Mana Curve'}
                    secondary={language === 'ja' 
                      ? 'マナコスト別のカード枚数（0〜7+）を棒グラフで表示'
                      : 'Bar chart showing card count by mana cost (0-7+)'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={language === 'ja' ? 'カードタイプ' : 'Card Types'}
                    secondary={language === 'ja' 
                      ? 'クリーチャー、インスタント、ソーサリー、エンチャント、アーティファクト、プレインズウォーカー、土地の分布'
                      : 'Distribution of Creatures, Instants, Sorceries, Enchantments, Artifacts, Planeswalkers, and Lands'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={language === 'ja' ? 'レアリティ' : 'Rarity'}
                    secondary={language === 'ja' 
                      ? 'コモン、アンコモン、レア、神話レアの分布'
                      : 'Distribution of Common, Uncommon, Rare, and Mythic Rare cards'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>{language === 'ja' ? '💡 分析の活用：' : '💡 Using Analysis:'}</strong>
              <br />• {language === 'ja' ? 'バランスの良いドラフト環境作り' : 'Creating balanced draft environments'}
              <br />• {language === 'ja' ? 'マナカーブの最適化' : 'Optimizing mana curve'}
              <br />• {language === 'ja' ? 'アーキタイプサポートの確認' : 'Verifying archetype support'}
              <br />• {language === 'ja' ? '詳細な統計は外部ドキュメントをご参照ください' : 'See external documentation for detailed statistics'}
            </Typography>
          </Alert>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {language === 'ja' ? 'キューブ設計のベストプラクティス' : 'Cube Design Best Practices'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {language === 'ja' 
              ? 'バランスの取れたキューブを作るためのガイドライン：'
              : 'Guidelines for creating balanced cubes:'}
          </Typography>
          
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom color="primary">
                {language === 'ja' ? '📏 推奨構成（360枚キューブの場合）' : '📏 Recommended Composition (360-card cube)'}
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary={language === 'ja' ? '各色50-60枚' : '50-60 cards per color'}
                    secondary={language === 'ja' ? '白、青、黒、赤、緑を均等に配分' : 'Equal distribution of White, Blue, Black, Red, and Green'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={language === 'ja' ? '多色カード30-50枚' : '30-50 multicolor cards'}
                    secondary={language === 'ja' ? '2色組み合わせを中心に、3色以上は慎重に' : 'Focus on 2-color combinations, use 3+ colors sparingly'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={language === 'ja' ? '無色カード20-40枚' : '20-40 colorless cards'}
                    secondary={language === 'ja' ? 'アーティファクト、土地、汎用カード' : 'Artifacts, lands, and utility cards'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom color="primary">
                {language === 'ja' ? '⚖️ バランス調整のコツ' : '⚖️ Balancing Tips'}
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Typography variant="body2">🎯</Typography></ListItemIcon>
                  <ListItemText 
                    primary={language === 'ja' ? 'パワーレベルの統一' : 'Consistent Power Level'}
                    secondary={language === 'ja' ? '極端に強い・弱いカードを避ける' : 'Avoid extremely powerful or weak cards'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Typography variant="body2">🔗</Typography></ListItemIcon>
                  <ListItemText 
                    primary={language === 'ja' ? 'シナジーの重視' : 'Focus on Synergies'}
                    secondary={language === 'ja' ? 'アーキタイプ間のシナジーとサポート' : 'Inter-archetype synergies and support'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Typography variant="body2">📊</Typography></ListItemIcon>
                  <ListItemText 
                    primary={language === 'ja' ? '定期的な分析' : 'Regular Analysis'}
                    secondary={language === 'ja' ? '分析機能でバランスを継続的にチェック' : 'Continuously check balance using analysis features'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Alert severity="warning">
            <Typography variant="body2">
              <strong>{language === 'ja' ? '⚠️ 注意：' : '⚠️ Important:'}</strong>
              {language === 'ja' 
                ? ' キューブ設計は反復的なプロセスです。実際にドラフトを行い、フィードバックを元に調整を続けることが重要です。'
                : ' Cube design is an iterative process. Actual drafting and continuous adjustment based on feedback is essential.'}
            </Typography>
          </Alert>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {language === 'ja' ? 'よくある質問（FAQ）' : 'Frequently Asked Questions (FAQ)'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Q: {language === 'ja' ? 'カードが見つからない場合は？' : 'What if I can\'t find a card?'}
            </Typography>
            <Typography variant="body2" paragraph>
              A: {language === 'ja' ? '以下をお試しください：' : 'Try the following:'}<br />
              • {language === 'ja' ? '日本語名での検索（自動翻訳機能があります）' : 'Search by Japanese name (auto-translation available)'}<br />
              • {language === 'ja' ? '英語名での検索' : 'Search by English name'}<br />
              • {language === 'ja' ? '部分的な名前での検索（「稲妻」「Lightning」など）' : 'Partial name search (e.g., "Lightning", "稲妻")'}<br />
              • {language === 'ja' ? 'Scryfall検索構文の使用（「t:creature cmc:3」など）' : 'Use Scryfall search syntax (e.g., "t:creature cmc:3")'}<br />
              • {language === 'ja' ? 'スペルミスがないか確認' : 'Check for spelling errors'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom color="primary">
              Q: {language === 'ja' ? 'セット選択機能はどう使いますか？' : 'How do I use the set selection feature?'}
            </Typography>
            <Typography variant="body2" paragraph>
              A: {language === 'ja' ? '検索結果で歯車アイコン（⚙）をクリックすると、そのカードの全セット版が表示されます。好みのアートワークや時代の版を選択してキューブに追加できます。' : 'Click the gear icon (⚙) in search results to view all printings of that card. You can select your preferred artwork or era version to add to your cube.'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom color="primary">
              Q: {language === 'ja' ? '分析結果の見方がわからない' : 'How do I interpret the analysis results?'}
            </Typography>
            <Typography variant="body2" paragraph>
              A: {language === 'ja' 
                ? '分析タブでは色バランス（円グラフ）、マナカーブ（棒グラフ）、カードタイプ分布などを確認できます。理想的なキューブでは各色が均等で、マナカーブが適切な山型になります。'
                : 'The Analysis tab shows color balance (pie chart), mana curve (bar chart), and card type distribution. An ideal cube has balanced colors and an appropriate bell-curved mana distribution.'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom color="primary">
              Q: {language === 'ja' ? 'データの共有やエクスポートはできますか？' : 'Can I share or export my data?'}
            </Typography>
            <Typography variant="body2" paragraph>
              A: {language === 'ja' 
                ? '現在のバージョンでは共有・エクスポート機能は未実装です。データはローカルのSQLiteデータベース（Docker環境では永続化ボリューム）に保存されます。'
                : 'Sharing and export features are not yet implemented. Data is stored in a local SQLite database (or persistent volume in Docker environment).'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom color="primary">
              Q: {language === 'ja' ? 'より詳しい使い方は？' : 'Where can I find more detailed instructions?'}
            </Typography>
            <Typography variant="body2" paragraph>
              A: {language === 'ja' 
                ? '上記のドキュメントセクションから、詳細なユーザーガイド、開発者ガイド、API仕様書をご確認ください。GitHub Issuesでも質問を受け付けています。'
                : 'Please refer to the Documentation section above for detailed User Guide, Developer Guide, and API specifications. You can also ask questions through GitHub Issues.'}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          MTG Cube Manager v1.0.0 | 
          Magic: The Gathering は Wizards of the Coast の商標です
        </Typography>
      </Box>
    </Box>
  );
};

export default Manual;